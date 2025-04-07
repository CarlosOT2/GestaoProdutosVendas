# AWS Basic Settings #
We'll configure AWS to website runs correctly, without this configuration it'll not work

<br/>
<h3> Creating a user with access to Secrets Manager </h3>
Creating a user that'll have access to Secrets Manager, After that, we'll use user credentials
<br/>
<br/>

<ol>
 <li>Go to the <code>IAM</code> service, in the Access management section click on <code>Users</code></li>
 <li>Click on Create User, choose a self-explanatory name</li>
 <li>Click on Next twice to create the user</li>
 <li>
 Create Secrets Manager access policy:
  <ul>
   <li>In the Access management section, go to <code>Policies</code> and click on Create policy</li>
   <li>In the Policy editor section click on <code>JSON</code></li>
   <li>In the Add actions section search for <code>Secrets Manager</code>, click on Secrets Manager</li>
   <li>Select the options <code>DescribeSecret</code>, and <code>GetSecretValue</code></li>
   <li>Under Add actions, go to Add a resource</li>
   <li>Click on Add, select <code>All Resources</code> in Resource Type, click on Add resource</li>
   <li>After that click on Next, choose a self-explanatory name, click on Create policy</li>
  </ul>
 </li>
 <li>
 Create encryption key in KMS:
  <ul>
   <li>Go to the <code>Key Management Service</code> service</li>
   <li>In the Customer managed keys section, click on Create key</li>
   <li>The selected options are; <code>Symmetric</code>, <code>Encrypt and decrypt</code>, <code>KMS - recommended</code>, <code>Single-Region key</code></li>
   <li>Click on Next, choose a self-explanatory name (it should explain that the key will encrypt Secrets Manager secrets)</li>
   <li>Click on Next four times, and click on Finish to create the key</li>
  </ul>
 </li>
 <li>
 Create KMS key access policy:
  <ul>
   <li>Copy the <code>ARN</code> of the key created previously, we'll return to <code>IAM</code></li>
   <li>Go to <code>Policies</code> and click Create policy</li>
   <li>In the Policy editor section click on <code>JSON</code></li>
   <li>In the Add actions section search for <code>KMS</code>, click on KMS</li>
   <li>Select the options <code>Decrypt</code> and <code>Encrypt</code></li> 
   <li>Go to Add a resource, click on Add, paste the <code>ARN</code> that you had copied in <code>Resource ARN</code>, click on Add resource</li>
   <li>Click on Next, choose a self-explanatory name, click Create policy</li>
  </ul>
 </li>
 <li>
 Assign previous policies to the User
  <ul>
   <li>Go to the <code>IAM</code> service, click on <code>Users</code>, click on the User that you created earlier</li>
   <li>Go to the <code>Permissions</code> section, click on Add permission, select the option Add permissions</li>
   <li>In the Permissions options section, select the option <code>Attach policies directly</code></li> 
   <li>Search for the two Policies created previously and select them</li>
   <li>Click on Next, verify that you selected correctly, click on Add permissions</li>
  </ul>
 </li>
</ol>

<br/>

<h3> Using the User Secrets Manager credentials </h3>
The credentials will be used locally on the server to access the service

<br/>
<br/>

<ol>
 <li>Install <code>AWS CLI</code>, verify that you installed the correct version (correct version is on the repository home page)</li>
 <li>
 Creating the credentials:
  <ul>
   <li>Go to <code>IAM</code>, click on <code>Users</code>, click on the User you previously created</li>
   <li>Go to the <code>Security credentials</code> section, search for the section Access keys, click on <code>Create access key</code></li>
   <li>Select the option <code>Local code</code>, after that select the option below Confirmation, click on Next</li>
   <li>Save the <code>Secret access key</code>, click on Create access key</li> 
   <li>Don't forget to save it, or you'll have to repeat this process again</li>
  </ul>
 </li>
 <li>
 Using the credentials:
  <ul>
   <li>Go to the directory <code>back-end</code> in command prompt, run the command <code>aws configure</code></li>
   <li>We'll use the credentials previously created, go to the Secrets Manager User</li>
   <li>In the section summary copy <code>Access key 1</code>, go back to command prompt</li>
   <li>In the input <code>AWS Access Key ID</code>, paste the Access key and press Enter</li>
   <li>In the input <code>AWS Secret Access Key</code>, paste the Secret access key saved previously and press Enter</li>
   <li>In the input <code>Default region name</code> use your region, the default option is us-east-1</li>
   <li>In the input <code>Default output format</code> type json</li>
   <li>After successfully creating the local credentials, you can choose to encrypt them for extra security or not</li>
  </ul>
 </li>
 <li>
 Encrypting credentials with dpapi (optional):
  <ul>
   <li>If you want extra security for your local credentials, do this process. otherwise, skip these steps</li>
   <li>Go to folder where the credentials are located, usually <code>USERNAME\.aws</code>, in the folder you'll create a file JSON</li>
   <li>The file will have the credentials, create a file exactly like this one just changing respective values ​​for accessKeyId and secretAccessKey (credentials values):
   <pre><code>{
  "accessKeyId": "accessKeyId",
  "secretAccessKey": "secretAccessKey"
}</code></pre>
  </li>
  <li>
  After that, we'll encrypt the json file with dpapi. there is a function in the directory <code>back-end\helpers\Encryption\dpapi.js</code> called encrypt(),
  it'll encrypt files using dpapi. you can use any method to encrypt it with dpapi
  </li>
  <li>
  We'll modify the source code, go to the file <code>back-end\helpers\Aws\secret_manager.js</code>. you'll find a commented code block. This block will decrypt the credentials file,
  delete the line <code>const client = new SecretsManagerClient()</code>, it'll be replaced by commented code block
  </li>
  <li>
  If dpapi encryption scope is different from <code>LocalMachine</code>, you'll have to modify the line <code>await decrypt</code> to:
  <pre><code>await decrypt({ path: credentials_path, scope: 'CurrentUser' })</code></pre>
  </li>
  </ul>
  </li>
  <li>After creating/encrypting the local credentials, open file <code>back-end\config\aws.js</code></li>
 <li>Change the variable <code>credentials_path</code> to path of the credentials file</li>
</ol>

<h3> Saving database root credentials </h3>
To save database root credentials, we'll use Secrets Manager, the server will access these credentials automatically

<br/>
<br/>

<ol>
 <li>Go to service Secrets Manager, click on <code>Store a new secret</code>, in section Secret type select the option <code>Other type of secret</code></li>
 <li>
   In the section key/value click on <code>Add row</code>, in first row the key/value will be respectively; <code>username/value</code>, in second row it'll be respectively; <code>password/value</code>.
   just changing respective values ​​for the database root credentials
 </li>
 <li>In the section <code>Encryption key</code>, select the encryption key created previously to encrypt Secrets Manager secrets</li>
 <li>Click Next, choose a self-explanatory name, click Next twice, click Store</li>
 <li>After creating it go to <code>back-end\config\aws.js</code>, change the variable <code>root_secret</code> to the name chosen previously</li>
</ol>
