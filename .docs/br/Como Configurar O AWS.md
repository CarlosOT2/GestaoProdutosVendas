# Como Configurar O AWS #

<h3> Configurando Secret Manager </h3>

1. Vá até o serviço `IAM`, na seção Access management clique em `Users`
2. Clique em `Create User`, o nome de usuário não importa muito, mas deve ser autoexplicativo
3. Clique em Next, clique em Next novamente, criando o usuário que irá ter permissões sobre o Secret Manager
4. Na seção Access management clique em `Policies`, clique em `Create policy`, Na seção Policy editor clique em `JSON`
5. Na seção `Add actions` pesquise por Secrets Manager, clique em Secrets Manager, selecione as opções `DescribeSecret`, e `GetSecretValue`
6. Embaixo de Add actions, vá até `Add a resource` clique em Add, selecione All Resources em `Resource Type`, clique em Add resource
7. Após isso, embaixo da página clique em Next, o nome não importa muito (deve ser autoexplicativo), clique em `Create policy`
8. Iremos criar outra policy, que irá descriptografar e criptografar segredos do Secrets Manager, porém antes iremos criar a chave de criptografia
9. Vá até o serviço `Key Management Service`, na seção Customer managed keys clique em `Create key`
10. As opções selecionadas são; `Symmetric`, `Encrypt and decrypt`, `KMS - recommended`, `Single-Region key`, clique em Next
11. Novamente o nome não é importante (deve explicar que irá criptografar segredos do Secrets Manager), clique em Next, clique em Next, clique em Next, clique em Next, clique em Finish, criando a chave
12. Copie o `ARN` da chave criada, iremos voltar para `IAM`, Na seção Access management clique em `Policies`, clique em `Create policy`, Na seção Policy editor clique em `JSON`
13. As etapas são semelhantes à Policy anterior, porém com valores diferentes, Na seção `Add actions` pesquise por KMS, clique em KMS, selecione as opções `Decrypt`, `Encrypt`
14. 

   
