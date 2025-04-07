# Como Instalar o Website #

<h3> Copiar a URL do Repositório </h3>

1. Vá até o repositório de GestãoProdutosVendas
2. Clique no botão "Code" (Código).
3. Copie a URL HTTPS ou SSH do repositório.

<h3> Clonar o Repositório com SSH </h3>

Caso não saiba o que seja SSH, [Como Se Conectar No Github Com SSH](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh)

1. No git bash, navegue até o diretório onde deseja clonar o repositório
2. Copie a URL SSH do repositório
3. Execute o comando `git clone git@github.com:usuario_nome/repo_nome.git`

<h3> Clonar o Repositório com HTTPS </h3>

1. No git bash, navegue até o diretório onde deseja clonar o repositório
2. Copie a URL HTTPS do repositório
3. Execute o comando `git clone https://github.com/usuario/repo.git`
<br/>

<h3> Configurando O Back-End </h3>

1. No terminal vá até o diretório GestãoProdutosVendas/back-end, execute o comando `npm i`
2. Abra o aplicativo `HeidiSQL` do banco de dados `MariaDB`, execute a query `CREATE DATABASE db_gestaoprodutosvendas`
3. No terminal do diretório back-end, execute o comando `npm run migrate:latest --env prod`
4. Após isso vá até o diretório `back-end\config`
5. No arquivo `users_win.js` altere server para o nome do usuário do windows que irá utilizar o website
6. Após isso, você terá que realizar a configuração do AWS [Configurações básicas AWS](./Configurações%20básicas%20AWS.md)
  
<h3> Configurando O Front-End </h3>

1. No terminal vá até o diretório de GestãoProdutosVendas/front-end, execute o comando `npm i`
2. Caso esteja usando uma URL personalizada, vá até `src\config`, altere a variável `WebService` do arquivo `config_websv.js` para a sua URL
<br/>
<h3> Como Configurar O Agendador De Tarefas </h3>

Configurar o Agendador de Tarefas é recomendado, porém opcional, você não precisa dele para que seu Website funcione. Ele oferecerá segurança extra [Configurações Agendador De Tarefas](./Configurações%20Agendador%20De%20Tarefas.md)











