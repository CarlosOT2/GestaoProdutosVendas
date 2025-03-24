# Como Configurar O AWS #

<h3> Criando O Usuário Do Secrets Manager </h3>
Criaremos um usuário que terá acesso ao Secrets Manager, Após criá-lo usaremos suas credenciais
<br/>
<br/>

14. Vá até `Add a resource` clique em Add, selecione key em `Resource Type`, cole o `ARN` que você copiou no `Resource ARN`, clique em Add resource, clique em Next
15. Novamente o nome não é importante, clique em Create policy, Agora temos todas as permissões para dar ao usuário que criamos acesso ao Secrets Manager
16. Vá até o serviço `IAM`, clique em `Users`, clique no usuário criado anteriormente, vá até a seção `Permissions`, clique em Add permissions, selecione a opção Add permissions novamente
17. Na seção `Permissions options` selecione a opção `Attach policies directly`, procure as duas permissões criadas anteriormente e selecione-as, clique em Next, verifique se você selecionou corretamente, clique em Add permissions

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
      <li>Após isso, embaixo da página clique em Next, escolha um nome autoexplicativo, clique em Create policy</li>
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
      <li>Copie o <code>ARN</code> da chave que você criou, retornaremos ao <code>IAM</code></li>
      <li>Retorne para <code>Policies</code> e clique em Create policy</li>
      <li>Na seção Policy editor clique em <code>JSON</code></li>
      <li>Na seção Add actions pesquise por <code>KMS</code>, clique em KMS</li>
      <li>Selecione as opções <code>Decrypt</code>, e <code>Encrypt</code></li>
      <li>Vá até Add a resource, clique em Add, cole o <code>ARN</code> que você copiou no <code>Resource ARN</code></li>
    </ul>
  </li>
  <li>Atribuir as permissões ao usuário criado</li>
</ol>

<br/>

<h3> Armazenando As Credenciais Do Secrets Manager Localmente </h3>





   
