# Como Configurar O AWS #

<h3> Configurando Secret Manager </h3>
Criaremos um usuário que terá acesso ao Secrets Manager, Após isso usaremos suas credenciais no servidor
<br/>
<br/>

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
14. Vá até `Add a resource` clique em Add, selecione key em `Resource Type`, cole o `ARN` que você copiou no `Resource ARN`, clique em Add resource, clique em Next
15. Novamente o nome não é importante, clique em Create policy, Agora temos todas as permissões para dar ao usuário que criamos acesso ao Secrets Manager
16. Vá até o serviço `IAM`, clique em `Users`, clique no usuário criado anteriormente, vá até a seção `Permissions`, clique em Add permissions, selecione a opção Add permissions novamente
17. Na seção `Permissions options` selecione a opção `Attach policies directly`, procure as duas permissões criadas anteriormente e selecione-as, clique em Next, verifique se você selecionou corretamente, clique em Add permissions

   
