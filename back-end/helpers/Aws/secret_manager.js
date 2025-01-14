/*
-- O Motivo Disso Está Dando Certo, É Porque A Credencial Default, Ter Permissão Para Acessar O 'Secrets Manager', Caso Mude O Default,
-- E Ele Não Tenha Permissão Á O 'Secrets Manager', Essas Funções Não Irão Funcionar, E Funções Que Usam Essas Funções Não Irão.
*/

//# Import //
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'
import fs from 'fs'
import dpapi from 'win-dpapi'
import { users } from '../../users_win/users.js'

//# Funções Exportadas //

export async function get_secret(secret_name, optional_config = {}) {
    const {
        console_error = true
    } = optional_config

    //# User //
    const { server } = users

    //# Client //
    const data = fs.readFileSync(`C:/Users/${server}/.aws/credentials`);
    const decryptedData = dpapi.unprotectData(data, null, "CurrentUser");
    const { accessKeyId, secretAccessKey } = JSON.parse(decryptedData)

    const client = new SecretsManagerClient({
        credentials: {
            accessKeyId,
            secretAccessKey
        }
    });

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