# Como o Website Está Estruturado #

<h3> Diretório Pai </h3>
é o diretório que contem todos os arquivos do projeto, sua estrutura seria;
<br/>
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
o back-end contém o <b>código-fonte da API</b> usada pelo front-end, que podemos chamar de servidor. um breve resumo da estrutura;
<br/>
<br/>

<pre>
# Contém os principais arquivos de configuração, que podem ser usados ​​em qualquer parte do servidor
│── config/ 
# Armazena dados do cliente e do próprio servidor, como imagens e credenciais locais
│── data/ 
# Contém dados/código relacionado ao banco de dados, como; logs, rotina de backup, estrutura do banco de dados. entre outros
│── db/ 
# Contém funções auxiliares que serão usadas em todo o servidor, como; funções para criptografia, paginação
│── helpers/    
│── node_modules/ 
# Contém as rotas da API, usada pelo front-end
│── routes/      
│── app.js   
│── package.js 
│── package-lock.js  
</pre>
<br/>

<h3> Front End </h3>
o front-end contém o código-fonte da <b>interface usada pelo usuário</b>, que podemos chamar de cliente. um breve resumo da estrutura;
<br/>
<br/>
