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

Podemos nos aprofundar na estrutura dos diretórios <b>data</b>, <b>db</b>, e rotas do diretório <b>routes</b>
<br/>

<pre>
/data
│── imgData/   
│   ├── produtos/       # Armazena imagens permanentes do cliente
│   ├── server_imagem/  # Armazena imagens do servidor, não podem ser excluídas ou alteradas
│   ├── temp_produtos/  # Armazena imagens temporárias para serem verificadas do cliente, antes de se tornarem permanentes
│── local_credentials/  # Armazena o script que excluirá a credencial local root do banco de dados e a própria credencial
</pre>

<pre>
/db
│── backup_logs/   # Contém logs de erros da rotina de backup, como erros de execução, verificação, etc...     
│── db_backups/    
│   │── backups/             # Armazena o arquivo de backup  
│   │── .backup_functions.js # Código-fonte do backup e restauração
│   │── backup_db.bat        # Script que realiza o backup
│   │── restore_db.bat       # Script que realiza a restauração
│── db_gestaoprodutosvendas/ # Armazena as migrations e seeds do banco de dados         
│── db_config.js             # Arquivo que será usado pelas rotas para se comunicar com o banco de dados
│── db_knex_file.js          # Arquivo de configuração do banco de dados próprio do knex   
│── root_credentials.js      # Funções usadas para recuperação e criação da credencial root do banco de dados
</pre>

<pre>
/routes
│── dashboard.js
│   │── Get /             
│   │── Get /overview
│── produtos.js
│   │── Get /            
│   │── Get /fitrar
│   │── Post /
│   │── Post /upload
│   │── Put /:id
│   │── Delete /:id
│── vendas.js  
│   │── Get /             
│   │── Get /filtrar
│   │── Post /
│   │── Delete /:id
</pre>

<br/>

<h3> Front End </h3>
o front-end contém o código-fonte da <b>interface usada pelo usuário</b>, que podemos chamar de cliente. um breve resumo da estrutura;
<br/>
<br/>
