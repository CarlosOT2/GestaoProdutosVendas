# How is The Website Structured #
Standards and structures that must be followed for better development

<h2> Standards </h2>

<ul>
  <li>Request
    <ul>
      <li>Every request sent to the server must be in JSON</li>
      <li>
We're using PerformRequest() function, located in helpers/js, to standardize requests.
All requests must be sent through this function
      </li>
    </ul>
 </li>
 <li>Response
   <ul>
     <li>Every Response sent from the server will be in JSON</li>
   </ul>
 </li>
   <li>Date Formatting
   <ul>
     <li>
     The default format sent to the server must be a string in the 'Y0000M00D00' format (e.g., 'Y2025M04D02' for '04/02/2025'). The value cannot be lower than '0100-01-01', as it is not supported by the database
     </li>
     <li>
     We're using the format_date() function, located in helpers/Date on back end, to format dates in database-accepted format. it converts dates from 'Y0000M00D00' to '0000-00-00'.
     </li>
   </ul>
  </li>
</ul>

<br/>
<h2> Structure of folders and files </h2>
A brief summary of the folders and files structure. For a deeper understanding, you may need to learn deeper on your own

<h3>Root directory</h3>

Directory that contains all the website files. Its structure would be;
<pre>
│── .docs/     # Documentation
│── back-end/  # Source code for Back End
│── front-end/ # Source code for Front End
│── .gitignore 
│── LICENSE         
│── README.en       
│── README          
</pre>

<h3> Back End </h3>

it contains the source code of the API, which we can name it to server. Its structure would be;
<pre>
│── config/   # Contains configuration files, which can be used anywhere on the server
│── data/     # Stores client and server data, such as; images and local credentials
│── db/       # Contains data/code related to the database, such as; logs, backup routine, database structure
│── helpers/  # Contains helper functions that will be used throughout the server, such as; functions for encryption, paging   
│── node_modules/ 
│── routes/   # Contains API routes used by front-end
│── app.js   
│── package.js 
│── package-lock.js  
</pre>

We can dive a little bit deeper into the structures of <b>data</b>, <b>db</b>, and <b>endpoints</b> of the routes
<pre>
/data
│── imgData/   
│   ├── produtos/       # Stores client permanent images 
│   ├── server_imagem/  # Stores server images, that cannot be deleted or modified by the client
│   ├── temp_produtos/  # Stores client temporary images, that'll be verified before becoming permanent
│── local_credentials/  # Stores a script that'll delete the local credentials database, alongside with the local credentials file
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
│   │── Get /          # Calcula dados brutos de vendas e gera o lucro com base nos valores brutos              
│   │── Get /overview  # Obtém um resumo de produtos e vendas. por exemplo; produto mais vendido e lucro mensal
│── produtos.js
│   │── Get /          # Obtêm os registros da tabela produtos
│   │── Get /fitrar    # Obtêm e filtra os registros da tabela produtos, com 'req.query'
│   │── Post /         # Adiciona um produto à tabela produtos
│   │── Post /upload   # Toda imagem passará por esta rota para verificação. Os caminhos obtidos são usados ​​no Post padrão
│   │── Put /:id       # Modifica registros específicos da tabela produtos 
│   │── Delete /:id    # Deleta registros da tabela produtos
│── vendas.js  
│   │── Get /          # Obtêm os registros da tabela vendas          
│   │── Get /filtrar   # Obtêm e filtra os registros da tabela vendas, com 'req.query'
│   │── Post /         # Adiciona uma/várias vendas à tabela vendas
│   │── Delete /:id    # Deleta registros da tabela vendas
</pre>





