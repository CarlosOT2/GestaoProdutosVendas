# Como o Website Está Estruturado #

<h3> Diretório Pai </h3>
é o diretório que contem todos os arquivos do projeto, sua estrutura seria;
<br/>
<br/>

<pre>
│── .docs/     # Documentação
│── back-end/  # Código-fonte do Back End
│── front-end/ # Código-fonte do Front End
│── .gitignore # Arquivos e pastas ignorados pelo Git
│── LICENSE         
│── README.en       
│── README          
</pre>

<h3> Back End </h3>
o back-end contém o <b>código-fonte da API</b> usada pelo front-end, que podemos chamar de servidor. um breve resumo da estrutura;
<br/>
<br/>

<pre>
│── config/   # Contém os principais arquivos de configuração, que podem ser usados ​​em qualquer parte do servidor
│── data/     # Armazena dados do cliente e do próprio servidor, como imagens e credenciais locais
│── db/       # Contém dados/código relacionado ao banco de dados, como; logs, rotina de backup, estrutura do banco de dados
│── helpers/  # Contém funções auxiliares que serão usadas em todo o servidor, como; funções para criptografia, paginação   
│── node_modules/ 
│── routes/   # Contém as rotas da API, usada pelo front-end   
│── app.js   
│── package.js 
│── package-lock.js  
</pre>

Podemos nos aprofundar na estrutura dos diretórios <b>db</b> e <b>data</b>
<br/>

<pre>
/data
# Armazena as imagens do servidor
│── imgData/
│   ├── produtos/       # Armazena imagens salvas do cliente
│   ├── server_imagem/  # Armazena imagens salvas pelo próprio servidor, não podem ser excluídas ou alteradas
│   ├── temp_produtos/  # Armazena imagens temporárias do cliente, antes de se tornarem permanentes na diretório produtos
│── local_credentials/   
</pre>

<pre>
/db
│── backup_logs/          
│── db_backups/
│── db_gestaoprodutosvendas/          
│── db_config.js 
│── db_knex_file.js          
│── root_credentials.js
</pre>

<br/>

<h3> Front End </h3>
o front-end contém o código-fonte da <b>interface usada pelo usuário</b>, que podemos chamar de cliente. um breve resumo da estrutura;
<br/>
<br/>
