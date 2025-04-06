# Backup and Restore # 
Before using backup and restore, make sure to complete the steps in [AWS Basic Settings](./AWS%20Basic%20Settings.md)

<h3>Configuring AWS</h3>
Setting up AWS cloud services to store backups

<ol>
  <li> Create Bucket:
    <ul>
      <li>Go to the service <code>S3</code>, after that click on <code>Create bucket</code></li>
      <li>In General configuration section modify the <code>Bucket name</code> to <code>mysql-db.backups</code></li>
      <li>Scroll down to section <code>Bucket Versioning</code> and select option Enable</li>
    </ul>
  </li>
  <li> Create S3 Bucket Access Policy:
    <ul>
      <li>Go to <code>Policies</code> and click on Create policy</li>
      <li>In the Policy editor section click on <code>JSON</code>, after that in section Add actions search fo <code>S3</code>, click on S3</li>
      <li>Select the options <code>ListBucket</code>, <code>PutObject</code> and <code>GetObject</code></li>
      <li>Go to section Add a resource, click on Add, select option <code>bucket</code> in Resource Type, paste <code>arn:aws:s3:::mysql-db.backups</code> in Resource ARN</li>
      <li>Repeat the previous step, but replacing previous ARN with <code>arn:aws:s3:::mysql-db.backups/*</code></li>
      <li>After that click on Next, choose a self-explanatory name, click on Create policy</li>
    </ul>
  </li>
  <li> Create User for S3 Bucket:
    <ul>
      <li>Go to the service <code>IAM</code>, in section Access management click on <code>Users</code>, after that click on Create User, choose a self-explanatory name</li>
      <li>Go to the section Permissions options, select the option <code>Attach policies directly</code>, search the Policy created previously and select it</li>
      <li>Verify that you selected correctly, click on Next, click on Create User</li>
    </ul>
  </li>
  <li> Create the credentials:
    <ul>
      <li>Go to <code>IAM</code>, click on <code>Users</code>, click on the User you previously created</li>
      <li>Go to the section <code>Security credentials</code>, search for the section Access keys, click on <code>Create access key</code></li>
      <li>Select the option <code>Local code</code>, after that select the option below Confirmation, click on Next</li>
      <li>Save the access keys <code>Access key</code> and <code>Secret access key</code>, click on Create access key</li>
      <li>Don't forget to save Secret access key, or you'll have to repeat this process again</li>
    </ul>
  </li>
  <li> Save Credentials as a Secret:
    <ul>
      <li>Go to the service Secrets Manager, click on <code>Store a new secret</code>, in section Secret type select the option <code>Other type of secret</code></li>
      <li>
      In the section key/value click on <code>Add row</code>, in first row the key/value will be respectively; <code>accessKeyId/Access key</code>, in second row it'll be respectively; <code>secretAccessKey/Secret access key</code>. just changing respective values ​​for the access keys
      </li>
      <li>In the section <code>Encryption key</code> select encryption key created to encrypt Secrets Manager secrets</li>
      <li>Click Next, choose a self-explanatory name, click Next twice, click Store</li>
      <li>
      After creating it go to <code>back-end\db\db_backups\.backup_functions.js</code>, change the variable <code>credentials_secret_name</code> inside the function
      backup_db(), for the secret name chosen previously
      </li>
    </ul>
  </li>
  
</ol>

<h3>Backup</h3>
How to execute backup correctly
</br>

1. Open the Command Prompt as an administrator (make sure the prompt has administrator privileges, otherwise it won’t have permissions to execute backup correctly)
2. In the prompt, go to the directory <code>back-end\db\db_backups</code>
3. In the prompt, execute the script <code>backup_db.bat</code>. the backup will be stored in the directory <code>back-end\db\db_backups\backups</code>, compressed into a 7Z file

<h3>Restore</h3>
How to execute restore correctly
</br>

1. Open the Command Prompt as an administrator (make sure Command prompt has admin privileges, otherwise it won’t have permissions to execute backup correctly)
2. In the prompt, go to the directory <code>back-end\db\db_backups</code>
3. In the prompt, execute the script <code>restore_db.bat</code>. the script can only restore backup files that're in the backups directory and were created using the script backup_db.bat
