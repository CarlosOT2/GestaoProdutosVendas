//# Import //
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { create_client } from './configure_aws_sdk.js'

//# Funções Exportadas //

export async function upload_s3(obj_config) { 

    //# Variáveis //
    const { credentials_secret_name, params } = obj_config
    
    //# Client //
    const client = await create_client(credentials_secret_name, S3Client)

    try {
        const command = new PutObjectCommand(params)
        const data = await client.send(command);
        console.log(`upload bucket ${params.Bucket}: ${data.ETag}`);
    } catch (error) {
        console.error(';------- Error upload_s3 -------;', error);
        throw error
    }
}