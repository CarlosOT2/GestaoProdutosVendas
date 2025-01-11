//# Import //
import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";
import { create_client } from './configure_aws_sdk.js'


export default async function encryption(credentials_secret_name) {

    //# Client //
    const client = await create_client(credentials_secret_name, KMSClient)
    
    //# Funções Retornadas //
    async function encrypt(Plaintext, KeyId) {
        const command = new EncryptCommand({
            KeyId: KeyId,
            Plaintext: Buffer.from(Plaintext)
        });
        try {
            const response = await client.send(command);
            const encrypted_data = Buffer.from(response.CiphertextBlob).toString('base64')
            return encrypted_data
        } catch (error) {
            console.error(';------- Error decrypt -------;', error);
            throw error
        }

    }
    async function decrypt(encrypted_text) {
        const command = new DecryptCommand({
            CiphertextBlob: Buffer.from(encrypted_text, 'base64'),
        });

        try {
            const response = await client.send(command);
            console.log(Buffer.from(response.Plaintext).toString('utf-8'))
            return Buffer.from(response.Plaintext).toString('utf-8')
        } catch (error) {
            console.error(';------- Error decrypt -------;', error);
        }
    }
    
    return { encrypt, decrypt }
}


