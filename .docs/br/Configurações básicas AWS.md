# Configurações básicas AWS #
Vamos configurar o AWS para o website rodar corretamente, sem essa configuração ele não funcionará

<br/>
<h3> Criando usuário com acesso ao Secrets Manager </h3>
Criaremos um usuário que terá acesso ao Secrets Manager, Após criá-lo usaremos suas credenciais
<br/>
<br/>

<ol>
  <li>Vá até o serviço <code>IAM</code>, na seção Access management clique em <code>Users</code></li>
  <li>Clique em Create User, escolha um nome autoexplicativo</li>
  <li>Clique em Next duas vezes para criar o usuário</li>
  <li>
    Criar Policy de acesso ao Secrets Manager:
    <ul>
      <li>Na seção Access management, Vá para <code>Policies</code> e clique em Create policy</li>
      <li>Na seção Policy editor clique em <code>JSON</code></li>
      <li>Na seção Add actions pesquise por <code>Secrets Manager</code>, clique em Secrets Manager</li>
      <li>Selecione as opções <code>DescribeSecret</code>, e <code>GetSecretValue</code></li>
      <li>Embaixo de Add actions, vá até Add a resource</li>
      <li>Clique em Add, selecione <code>All Resources</code> em Resource Type, clique em Add resource</li>
      <li>Após isso clique em Next, escolha um nome autoexplicativo, clique em Create policy</li>
    </ul>
  </li>
  <li>
    Criar chave de criptografia no KMS:
    <ul>
      <li>Vá até o serviço <code>Key Management Service</code></li>
      <li>Na seção Customer managed keys clique em Create key</li>
      <li>As opções selecionadas são; <code>Symmetric</code>, <code>Encrypt and decrypt</code>, <code>KMS - recommended</code>, <code>Single-Region key</code></li>
      <li>Clique em Next, escolha um nome autoexplicativo (deve explicar que a chave criptografará os segredos do Secrets Manager)</li> 
      <li>Clique em Next quatro vezes, e clique em Finish para criar a chave</li>
    </ul>
  </li>
  <li>
    Criar Policy de acesso á chave do KMS:
    <ul>
      <li>Copie o <code>ARN</code> da chave criada anteriormente, retornaremos ao <code>IAM</code></li>
      <li>Vá para <code>Policies</code> e clique em Create policy</li>
      <li>Na seção Policy editor clique em <code>JSON</code></li>
      <li>Na seção Add actions pesquise por <code>KMS</code>, clique em KMS</li>
      <li>Selecione as opções <code>Decrypt</code>, e <code>Encrypt</code></li>
      <li>Vá até Add a resource, clique em Add, cole o <code>ARN</code> que você copiou no <code>Resource ARN</code>, clique em Add resource</li>
      <li>Clique em Next, escolha um nome autoexplicativo, clique em Create policy</li>
    </ul>
  </li>
  <li>
    Atribuir as Policies ao usuário do Secrets Manager 
    <ul>
      <li>Vá até o serviço <code>IAM</code>, clique em <code>Users</code>, clique no usuário do Secrets Manager criado anteriormente</li> 
      <li>Vá até a seção <code>Permissions</code>, clique em Add permission, selecione a opção Add permissions</li>
      <li>Na seção Permissions options selecione a opção <code>Attach policies directly</code></li>
      <li>Procure as duas Policies criadas anteriormente e selecione-as</li>
      <li>Clique em Next, verifique se você selecionou corretamente, clique em Add permissions</li>
    </ul>
  </li>
</ol>

<br/>

<h3> Utilizando as credenciais do usuário Secrets Manager </h3>
Utilizaremos para acessar o serviço localmente no servidor

<br/>
<br/>

<ol>
  <li>Instale o <code>AWS CLI</code>, verifique se a versão correta foi instalada (a versão correta está na página inicial do repositório) </li>
  <li>
    Criando as credenciais:
    <ul>
      <li>Vá até <code>IAM</code>, clique em <code>Users</code>, clique no usuário do Secrets Manager</li>
      <li>Vá até a seção <code>Security credentials</code>, procure a seção Access keys, clique em <code>Create access key</code></li>
      <li>Selecione a opção <code>Local code</code>, após isso selecione a opção abaixo de Confirmation, clique em Next</li>
      <li>Salve a chave de acesso <code>Secret access key</code>, clique em Create access key</li>
      <li>Não se esqueça de salvá-lo, ou terá que repetir o processo novamente</li>
    </ul>
  </li>
  <li>
    Utilizando as credenciais: 
    <ul>
      <li>Vá até o diretório <code>back-end</code> no terminal de comando, execute o comando <code>aws configure</code></li>
      <li>Utilizaremos as credenciais criadas anteriormente, vá até o usuário do Secrets Manager</li>
      <li>Na seção summary copie o <code>Access key 1</code>, volte ao terminal de comando</li>
      <li>No input <code>AWS Access Key ID</code> cole o Access key e pressione Enter</li>
      <li>No input <code>AWS Secret Access Key</code> cole a chave de acesso Secret access key salva anteriormente, pressione Enter</li>
      <li>No input <code>Default region name</code> use sua região, a opção padrão seria us-east-1</li>
      <li>No input <code>Default output format</code> escreva json</li>
      <li>Após criamos com sucesso as credenciais locais, podemos escolher criptografá-la para maior segurança ou não</li>
    </ul>
  </li>
  <li>
    Criptografando as credenciais com dpapi (opcional):
    <ul>
      <li>Se você deseja segurança extra para suas credenciais locais, faça este processo. caso contrário, pule estas etapas</li>
      <li>Vá até a pasta onde as credenciais estão localizadas, geralmente <code>USERNAME\.aws</code>, na pasta você criará um arquivo JSON</li>
      <li>O arquivo conterá as credenciais, crie um arquivo igual a esse apenas alterando os respectivos valores para accessKeyId e secretAccessKey (valores das credenciais):
      <pre><code>{
  "accessKeyId": "accessKeyId",
  "secretAccessKey": "secretAccessKey"
}</code></pre>
      </li>
      <li>
        Após isso, criptografaremos o arquivo json com dpapi. para isso temos uma função pronta no diretório <code>back-end\helpers\Encryption\dpapi.js</code> chamada encrypt(),
        ela criptografará os arquivos usando dpapi. use qualquer método para criptografá-lo com dpapi
      </li>
      <li> 
        Iremos alterar o código, vá até o arquivo <code>back-end\helpers\Aws\secret_manager.js</code>. você encontrará um bloco de código comentado. este bloco será o código que irá descriptografar o arquivo das credenciais,
        apague a linha de código <code>const client = new SecretsManagerClient()</code>, substituída pelo bloco de código comentado
      </li>
      <li>
        Caso o escopo de criptografia do dpapi for diferente de <code>LocalMachine</code>, você terá que alterar a linha <code>await decrypt</code> para:
        <pre><code>await decrypt({ path: credentials_path, scope: 'CurrentUser' })</code></pre>
      </li>
    </ul>
  </li>
  <li>Após criar/criptografar as credenciais local, abra o arquivo <code>back-end\config\aws.js</code></li>
  <li>Altere a variável <code>credentials_path</code> para o caminho do arquivo das credenciais</li>
</ol>

<h3> Salvando credenciais root do banco de dados </h3>
Para salvar as credenciais root do banco de dados, usaremos o Secrets Manager, o servidor acessará essas credenciais automaticamente

<br/>
<br/>

<ol>
  <li>Vá até o serviço Secrets Manager, clique em <code>Store a new secret</code>, na seção Secret type selecione a opção <code>Other type of secret</code></li>
  <li>
    Na seção key/value clique em <code>Add row</code>, na primeira Row o key/value será respectivamente; <code>username/valor</code>, na segunda row será respectivamente; <code>password/valor</code>. 
    apenas alterando os respectivos valores para as credenciais do root
  </li>
  <li>Na seção <code>Encryption key</code> selecione a chave de criptografia criada anteriormente para criptografar os segredos do Secrets Manager</li>
  <li>Clique em Next, escolha um nome autoexplicativo, clique em Next duas vezes, clique em Store</li>
  <li>Após cria-lo vá para <code>back-end\config\aws.js</code>, altere a variável <code>root_secret</code> para o nome escolhido anteriormente</li>
</ol>





   
