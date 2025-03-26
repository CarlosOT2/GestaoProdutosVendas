/*
-- O Motivo Disso Está Dando Certo, É Porque A Credencial Default, Ter Permissão Para Acessar O 'Secrets Manager', Caso Mude O Default,
-- E Ele Não Tenha Permissão Á O 'Secrets Manager', Essas Funções Não Irão Funcionar, E Funções Que Usam Essas Funções Não Irão.
*/

//# Import //
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'
import { decrypt } from '../../helpers/Encryption/dpapi.js'
import { credentials_path } from '../../config/aws.js'

//# Funções Exportadas //

export async function get_secret(secret_name, optional_config = {}) {
    const {
        console_error = true
    } = optional_config

    //# Client //
    /*
        const decryptedData = await decrypt({ path: credentials_path })
        const { accessKeyId, secretAccessKey } = JSON.parse(decryptedData)
        const client = new SecretsManagerClient({
            credentials: {
                accessKeyId,
                secretAccessKey
            }
        });
    */
    const client = new SecretsManagerClient()


    const command = new GetSecretValueCommand({ SecretId: secret_name });
    try {
        const data = await client.send(command);

        if ('SecretString' in data) {
            return JSON.parse(data.SecretString)

        }
        if ('SecretBinary' in data) {
            const buff = Buffer.from(data.SecretBinary, 'base64');
            return JSON.parse(buff.toString('ascii'))
        }
        throw Error(`Unknown 'data' format received from Secrets Manager`)
    } catch (error) {
        if (console_error) console.error(';------- Error get_secret -------;', error.message)
        throw error;
    }
}