# Como o Website Está Estruturado #
Um breve resumo de toda a estrutura do website, sem muitos detalhes. para entender mais, você terá que se aprofundar mais por conta própria
<br/>

<h3> Diretório Pai </h3>
é o diretório que contem todos os arquivos do projeto, sua estrutura seria;
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
o back-end contém o <b>código-fonte da API</b> usada pelo front-end, que podemos chamar de servidor, sua estrutura seria;
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

Podemos nos aprofundar um pouco na estrutura dos diretórios <b>data</b>, <b>db</b>, e os <b>endpoints</b> das rotas do diretório routes
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

<br/>

<h3> Front End </h3>
o front-end contém o código-fonte da <b>interface usada pelo usuário</b>, que podemos chamar de cliente, sua estrutura seria;
<br/>

<pre>
│── node_modules/
│── public/       # Contém arquivos estáticos que não passam pelo processamento do React
│── src/          # Código-fonte da aplicação React, onde o website está localizado
│── package.js
│── package-lock.js
</pre>

No diretório <b>src</b>
<pre>
│── components/ # Contém os componentes do website
│── config/     # Contém os arquivos de configuração, que podem ser usados ​​em qualquer parte do front
│── helpers/    # Contém funções auxiliares que serão usadas em todo o front, como; funções para requisições, paginação  
│── App.js      
│── App.scss    # Estilos do App.js (que afeta todo o website)
│── index.js
</pre>

Podemos nos aprofundar nos diretórios <b>components</b> e <b>config</b>

<pre>
│── Componentes Globais/  # Componentes redundantes usados ​​em diversos outros componentes
│   │── Div/              # Componentes que têm uma div como a tag raiz
│   │── Inputs/           # Componentes inputs que recebem entrada de dados 
│   │── Lista/            # Componentes relacionados a uma tabela/lista
│   │── Miscellaneous/    # Componentes que não se encaixam em nenhuma das categorias mencionadas 
│   │── Theme/            # Componentes relacionados ao tema do website
│── Menu Lateral/         # Componentes usados ​​no menu lateral
│   │── MenuLateral
│── Rota DashBoard/       # Componentes usados na URL /dashboard
│   │── Geral/
│   │   │── GeralDshB
│   │   │── GeralForm
│   │── MainDshB
│── Rota Home/            # Componentes usados na URL Home (URL base)
│   │── Home 
│   │── MainHome
│── Rota Inclusão/        # Componentes usados na URL /inclusao 
│   │── InputProdutos     
│   │── InputVendas
│   │── MainInclusao
│── Rota Manutenção/      # Componentes usados na URL /manut 
│   │── ListaProdutos
│   │── ListaVendas
│   │── MainManut
│   │── Manutencao
│   │── ManutForm
</pre>
