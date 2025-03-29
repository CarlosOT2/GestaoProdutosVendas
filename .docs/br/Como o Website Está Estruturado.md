# Como o Website Está Estruturado #

<h3> Diretório Pai </h3>
é o diretório que contem todos os arquivos do projeto, sua estrutura seria;
<br/>

<pre>
│── .docs/          # Documentação
│── back-end/       # Código-fonte do Back End
│── front-end/      # Código-fonte do Front End
│── .gitignore      # Arquivos e pastas ignorados pelo Git
│── LICENSE         
│── README.en       
│── README          
</pre>

<h3> Back End </h3>
o back-end contém o código-fonte da API usada pelo front-end, que podemos chamar de servidor
<pre>
│── config/ # Contém os principais arquivos de configuração, que podem ser usados ​​em qualquer parte do servidor
│── data/ # Armazena dados do cliente e do próprio servidor, como imagens e credenciais locais    
│── db/      
│── helpers/    
│── node_modules/         
│── routes/      
│── app.js   
│── package.js 
│── package-lock.js  
</pre>
<br/>

<h3> Front End </h3>
o front-end contém o código-fonte da interface usada pelo usuário, que podemos chamar de cliente
