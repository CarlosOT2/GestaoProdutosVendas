# Como o Website Está Estruturado #
Normas e estruturas que devem ser seguidas para um melhor desenvolvimento

<h2> Regras </h2>
<ul>
  <li>Request
    <ul>
      <li>Cada requisição enviada ao servidor deve estar em JSON</li>
      <li>
        Usamos a função PerformRequest(), localizada em helpers/js, para padronizar as requisições. 
        Todas as requisições devem ser feitas usando desta função
      </li>
    </ul>
  </li>
  <li>Response
    <ul>
      <li>Cada Response enviada do servidor estará em JSON</li>
    </ul>
  </li>
  <li>Formatação Data
    <ul>
      <li>
        Formato padrão enviado ao servidor deve ser 'Y0000M00D00' uma string.  O valor não pode ser abaixo que '0100-01-01', não é suportado pelo banco de dados.   
      </li>
      <li>
        Para formatar a data corretamente é usado a função format_date(), localizada na pasta helpers/Date no back-end. irá formatar datas como 'Y0000M00D00' para '0000-00-00'
      </li>
    </ul>
  </li>
</ul>

<br/>
<h2> Estrutura de pastas e arquivos </h2>
Breve resumo de toda a estrutura de pastas e arquivos. para compreender além, você terá que se aprofundar mais por conta própria



<h3> Diretório pai </h3>

Diretório que contem todos os arquivos do website. Sua estrutura seria;
<pre>
│── .docs/     # Documentação
│── back-end/  # Código-fonte do Back End
│── front-end/ # Código-fonte do Front End
│── .gitignore 
│── LICENSE         
│── README.en       
│── README          
</pre>

<h3> Back End </h3>

Contém o código-fonte da API, que podemos chamar de servidor. Sua estrutura seria;
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
<pre>
/data
│── imgData/   
│   ├── produtos/       # Armazena imagens permanentes do cliente
│   ├── server_imagem/  # Armazena imagens do servidor, que não podem ser excluídas ou alteradas
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

Contém o código-fonte da interface do usuário, que podemos chamar de cliente. Sua estrutura seria;
<pre>
│── node_modules/
│── public/       # Contém arquivos estáticos que não passam pelo processamento do React
│── src/          # Código-fonte da aplicação React, onde o website está localizado
│── package.js
│── package-lock.js
</pre>

Dentro do diretório <b>src</b>;
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
/components
│── Componentes Globais/  # Componentes redundantes usados ​​em diversos outros componentes
│   │── Div/              # Componentes que têm uma div como a tag raiz
│   │── Inputs/           # Componentes inputs que recebem entrada de dados 
│   │── Lista/            # Componentes relacionados a uma tabela/lista
│   │── Miscellaneous/    # Componentes que não se encaixam em nenhuma das categorias mencionadas 
│   │── Theme/            # Componentes relacionados ao tema do website
│── Menu Lateral/         # Componentes usados ​​no menu lateral
│   │── MenuLateral
│── Rota DashBoard/       # Componentes usados na rota DashBoard (/dashboard)
│   │── Geral/            # Componentes usados na rota DashBoard Geral (dashboard/geral)
│   │   │── GeralDshB     
│   │   │── GeralForm     # Componente form usado para filtrar os dados da seção produtos
│   │── MainDshB
│── Rota Home/            # Componentes usados na rota Home (/)
│   │── Home 
│   │── MainHome
│── Rota Inclusão/        # Componentes usados na rota Inclusão (/inclusao)
│   │── InputProdutos     # Componente form usado para adicionar produtos 
│   │── InputVendas       # Componente form usado para adicionar vendas
│   │── MainInclusao
│── Rota Manutenção/      # Componentes usados na rota Manutenção (/manut)
│   │── ListaProdutos     # Componente que usa o componente global Lista para exibir registros da tabela produtos
│   │── ListaVendas       # Componente que usa o componente global Lista para exibir registros da tabela vendas 
│   │── MainManut
│   │── Manutencao        # Componente que reúne os componentes da Rota Manutenção, exceto o MainManut, fundindo a lógica
│   │── ManutForm         # Componente form usado para filtrar os dados de ambas as listas (produtos, e vendas)
</pre>

<pre>
/config
│── global_scss/        # Contém arquivos SCSS com estilos padrão reutilizáveis ​​(facilitando a padronização e alterações)
│   │── inputs.scss
│   │── label.scss
│   │── lista.scss
│   │── media.scss 
│   │── scrolling.scss 
│   │── user-select.scss
│── usr_cnfg/           # Contém arquivos e funções para a configuração do usuário, como o tema
│   │── context/
│   │── local_storage/
│   │── scss/           
│── config_websv.js     # Contém a URL padrão usada no website
</pre>
