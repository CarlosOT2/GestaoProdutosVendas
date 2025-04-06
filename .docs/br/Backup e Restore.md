# Backup e Restore #
Antes de utilizar o backup e restore, faça estas etapas [Configurações básicas AWS](./Configurações%20básicas%20AWS.md)

<h3>Configurar AWS</h3>
Configuração para armazenar o backup em nuvem, usando do AWS

<ol>
  <li> Crie o Bucket:
    <ul>
      <li>Vá até o serviço <code>S3</code>, após isso clique em <code>Create bucket</code></li>
      <li>Na seção General configuration defina o Bucket name para <code>mysql-db.backups</code></li>
      <li>Desça até a seção <code>Bucket Versioning</code> e selecione a opção Enable</li>
    </ul>
  </li>
  <li> Crie Policy de acesso ao bucket do S3:
    <ul>
      <li>Vá para <code>Policies</code> e clique em Create policy</li>
      <li>Na seção Policy editor clique em <code>JSON</code>, após isso na seção Add actions pesquise por <code>S3</code>, clique em S3</li>
      <li>Selecione as opções <code>ListBucket</code>, <code>PutObject</code> e <code>GetObject</code></li>
      <li>Vá até a seção Add a resource, clique em Add, selecione <code>bucket</code> em Resource Type, cole <code>arn:aws:s3:::mysql-db.backups</code> em Resource ARN</li>
      <li>Repita a etapa anterior, porém colando <code>arn:aws:s3:::mysql-db.backups/*</code> em vez do anterior</li>
      <li>Após isso clique em Next, escolha um nome autoexplicativo, clique em Create policy</li>
    </ul>
  </li>
  <li> Crie o Usuário para bucket do S3:
    <ul>
      <li>Vá até o serviço <code>IAM</code>, na seção Access management clique em <code>Users</code>, após isso clique em Create User, escolha um nome autoexplicativo</li>
      <li>Vá até a seção Permissions options, selecione a opção <code>Attach policies directly</code>, procure a Policy criada anteriormente e selecione-a</li>
      <li>Verifique se você selecionou corretamente, clique em Next, clique em Create User</li>
    </ul>
  </li>
  <li> Crie as credenciais:
    <ul>
      <li>Vá até <code>IAM</code>, clique em <code>Users</code>, clique no usuário criado anteriormente</li>
      <li>Vá até a seção <code>Security credentials</code>, procure a seção Access keys, clique em <code>Create access key</code></li>
      <li>Selecione a opção <code>Local code</code>, após isso selecione a opção abaixo de Confirmation, clique em Next</li>
      <li>Salve as chaves <code>Access key</code> e <code>Secret access key</code>, clique em Create access key</li>
      <li>Não se esqueça de salvar o Secret access key, ou terá que repetir o processo novamente</li>
    </ul>
  </li>
  <li> Salve as Credenciais como um Segredo:
    <ul>
      <li>Vá até o serviço Secrets Manager, clique em <code>Store a new secret</code>, na seção Secret type selecione a opção <code>Other type of secret</code></li>
      <li>
      Na seção key/value clique em <code>Add row</code>, na primeira Row o key/value será respectivamente; <code>accessKeyId/Access key</code>, na segunda row será respectivamente; <code>secretAccessKey/Secret access key</code>. apenas alterando os respectivos valores para as chaves de acesso
      </li>
      <li>Na seção <code>Encryption key</code> selecione a chave de criptografia criada para criptografar os segredos do Secrets Manager</li>
      <li>Clique em Next, escolha um nome autoexplicativo, clique em Next duas vezes, clique em Store</li>
      <li>
      Após cria-lo vá para <code>back-end\db\db_backups\.backup_functions.js</code>, altere a variável <code>credentials_secret_name</code> dentro da função
      backup_db(), para o nome do segredo escolhido anteriormente
      </li>
    </ul>
  </li>
  
</ol>

<h3>Backup</h3>
Como executar o backup corretamente
</br>

1. Abra o prompt de comando como administrador  (verifique se o prompt tem permissão de administrador, caso contrário ele não terá permissão para executar o backup corretamente)
2. No prompt, vá até o diretório <code>back-end\db\db_backups</code>
3. No prompt, execute o script <code>backup_db.bat</code>. o backup será armazenado no diretório <code>back-end\db\db_backups\backups</code>, compactado em um arquivo 7Z

<h3>Restore</h3>
Como executar o restore corretamente
</br>

1. Abra o prompt de comando como administrador  (verifique se o prompt tem permissão de administrador, caso contrário ele não terá permissão para executar o backup corretamente)
2. No prompt, vá até o diretório <code>back-end\db\db_backups</code>
3. No prompt, execute o script <code>restore_db.bat</code>. o script só pode restaurar arquivos de backup que estejam na pasta backups e que tenham sido criados com o script backup_db.bat
