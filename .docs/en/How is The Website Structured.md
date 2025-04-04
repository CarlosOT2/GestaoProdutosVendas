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

We can delve a little deeper into the structures of <b>data</b>, <b>db</b>, and <b>endpoints</b> of the routes
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
│── backup_logs/   # Logs errors that occur during backup and restore execution
│── db_backups/    
│   │── backups/             # Stores backup file
│   │── .backup_functions.js # Source code for backup and restore functions
│   │── backup_db.bat        # Script that executes backup function
│   │── restore_db.bat       # Script that executes restore function
│── db_gestaoprodutosvendas/ # Stores database migrations and seeds    
│── db_config.js             # File used by the routes to communicate with the database
│── db_knex_file.js          # Database configuration file made by knex
│── root_credentials.js      # Functions used to retrieve the database root credentials and create them locally
</pre>

<pre>
/routes
│── dashboard.js
│   │── Get /          # Calculates gross sales data and generates profit based on gross values          
│   │── Get /overview  # Get a summary of the produtos and vendas tables. example; best-selling product and monthly profit
│── produtos.js
│   │── Get /          # Gets records from the produtos table
│   │── Get /fitrar    # Gets and filters records from the produtos table, with 'req.query'
│   │── Post /         # Add a product to the produtos table
│   │── Post /upload   # Every image will go through this endpoint for verification. The obtained paths are used in default Post
│   │── Put /:id       # Modify records from the produtos table
│   │── Delete /:id    # Delete records from the produtos table
│── vendas.js  
│   │── Get /          # Gets records from the vendas table          
│   │── Get /filtrar   # Gets and filters records from the vendas table, with 'req.query'
│   │── Post /         # Add one or more sales to the vendas table
│   │── Delete /:id    # Delete records from the vendas table
</pre>

<h3> Front End </h3>

it contains the source code of the UI, which we can name it to client. Its structure would be;
<pre>
│── node_modules/
│── public/ # Contains static files that do not go through React processing
│── src/ # Source code for React application
│── package.js
│── package-lock.js
</pre>

Inside <b>src</b> directory;
<pre>
│── components/ # Contains all components
│── config/ # Contains configuration files, which can be used anywhere on the client 
│── helpers/ # Contains helper functions that will be used throughout the client, such as; functions for encryption, paging
│── App.js
│── App.scss # App.js styles (It can affect the entire client)
│── index.js
</pre>

We can delve a little deeper into the structures of <b>components</b> and <b>config</b>
<pre>
/components
│── Componentes Globais/  # Redundant components reused in other components       
│   │── Div/              # Components that behave like a div
│   │── Inputs/           # Input components that receive data entries
│   │── Lista/            # components related to tables and lists
│   │── Miscellaneous/    # Components not classified under any of the mentioned categories
│   │── Theme/            # UI Theme Related Components
│── Menu Lateral/         # Components used in sidebar menu
│   │── MenuLateral
│── Rota DashBoard/       # Components used in DashBoard route (/dashboard)
│   │── Geral/            # Components used in DashBoard Geral route (dashboard/geral)
│   │   │── GeralDshB     
│   │   │── GeralForm     # Inputs form component designed to filter data in produtos section
│   │── MainDshB
│── Rota Home/            # Components used in Home route (/)
│   │── Home 
│   │── MainHome
│── Rota Inclusão/        # Components used in Inclusão route (/inclusao)
│   │── InputProdutos     # Inputs form component used to add products          
│   │── InputVendas       # Inputs form component used to add sales
│   │── MainInclusao
│── Rota Manutenção/      # Components used in Manutenção route (/manut)
│   │── ListaProdutos     # Component that uses the redundant component Lista.js to display records from the produtos table
│   │── ListaVendas       # Component that uses the redundant component Lista.js to display records from the vendas table 
│   │── MainManut
│   │── Manutencao        # Component that gathers all components of the Manutenção Route, except MainManut, merging the logic
│   │── ManutForm         # Inputs form component designed to filter data from both lists (ListaProdutos and ListaVendas)
</pre>

<pre>
/config
│── global_scss/        # Contains SCSS files with reusable default styles for standardization and easier changes
│   │── inputs.scss
│   │── label.scss
│   │── lista.scss
│   │── media.scss 
│   │── scrolling.scss 
│   │── user-select.scss
│── usr_cnfg/           # Contains files and functions for user configuration
│   │── context/
│   │── local_storage/
│   │── scss/           
│── config_websv.js     # Contains the default URL
</pre>





