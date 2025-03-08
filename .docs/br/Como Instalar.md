# Como Instalar o Website #

<h3> Copiar a URL do Repositório </h3>

1. Vá até o repositório de GestãoProdutosVendas
2. Clique no botão "Code" (Código).
3. Copie a URL HTTPS ou SSH do repositório.

<h3> Clonar o Repositório com SSH </h3>

Caso não saiba o que seja SSH, [Como Se Conectar No Github Com SSH](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh)

1. No git bash, navegue até o diretório onde deseja salvar o repositório
2. Copie a URL SSH do repositório
3. Execute o comando `git clone git@github.com:usuario_nome/repo_nome.git`

<h3> Clonar o Repositório com HTTPS </h3>

1. No git bash, navegue até o diretório onde deseja salvar o repositório
2. Copie a URL HTTPS do repositório
3. Execute o comando `git clone https://github.com/usuario/repo.git`
<br/>
<h3> Configurando O Back-End </h3>

1. No terminal vá até o diretório de GestãoProdutosVendas
2. Execute o comando `npm i`, no diretório back-end
3. Após isso vá até o diretório `back-end\config`
4. No arquivo `users_win.js` altere server para o nome do usuário que irá utilizar o website
5. No arquivo `aws.js` altere credentials_path para o caminho do arquivo das credenciais do aws
6. Vá até a interface do `HeidiSQL` do banco de dados `MariaDB`, execute a query `CREATE DATABASE db_gestaoprodutosvendas`


<h3> Configurando O Front-End </h3>

1. No terminal vá até o diretório de GestãoProdutosVendas
2. Execute o comando `npm i`, no diretório front-end
3. Caso esteja usando uma URL distinta, vá até `src\config`, altere o arquivo `config_websv.js` para a sua URL
<br/>
<h3> Configurando O Agendador De Tarefas </h3>

Uma parte essencial que não pode ser ignorada [Como Configurar O Agendador De Tarefas](./Como%20Configurar%20O%20Agendador%20De%20Tarefas.md)







