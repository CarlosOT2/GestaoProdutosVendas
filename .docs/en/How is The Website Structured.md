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
<h2> Organization of folders and files </h2>
A brief summary of the folders and files organization. For a deeper understanding, you may need to learn deeper on your own

<h3>Root directory</h3>

Directory that contains all the website files. its structure would be;
<pre>
│── .docs/     # Documentation
│── back-end/  # Back end source code 
│── front-end/ # Front end source code 
│── .gitignore 
│── LICENSE         
│── README.en       
│── README          
</pre>

<h3> Back End </h3>

it contains the source code of the API, which we can name it to server. Its structure would be;
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





