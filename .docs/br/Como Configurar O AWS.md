# Como Configurar O AWS #

<h3> Configurando Secret Manager </h3>

1. Vá até o serviço IAM, na seção Access management clique em `Users`
2. Clique em `Create User`, o nome de usuário não importa muito, mas deve ser autoexplicativo
3. Clique em Next, clique em Next novamente, criando o usuário que irá ter permissões sobre o Secret Manager
4. Na seção Access management clique em `Policies`, clique em `Create policy`, Na seção Policy editor clique em `JSON`
5. Na seção `Add actions` pesquise por Secrets Manager, clique em Secrets Manager, selecione as opções `DescribeSecret`, e `GetSecretValue`
6. Embaixo de Add actions, vá até `Add a resource` clique em Add, selecione All Resources em `Resource Type`, clique em Add resource
   
