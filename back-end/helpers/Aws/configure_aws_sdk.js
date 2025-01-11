//# Import //
import { get_secret } from './secret_manager.js'

//# Funções Exportadas //
export async function create_client(credentials_secret_name, client) {
    const credentials = await get_secret(credentials_secret_name)

    const new_cliente = new client({
        credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey
        }
    })
    return new_cliente
}