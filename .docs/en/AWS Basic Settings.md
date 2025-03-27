# AWS Basic Settings #
We'll configure AWS to website works correctly, without this configuration it'll not work

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
   <li>Copy the <code>ARN</code> of the key created previously, we will return to <code>IAM</code></li>
   <li>Return to <code>Policies</code> and click Create policy</li>
   <li>In the Policy editor section click <code>JSON</code></li>
   <li>In the Add actions section search for <code>KMS</code>, click KMS</li>
   <li>Select the <code>Decrypt</code> and <code>Encrypt</code></li> options
   <li>Go to Add a resource, click Add, paste the <code>ARN</code> you copied in <code>Resource ARN</code>, click Add resource</li>
   <li>Click Next, choose a self-explanatory name, click Create policy</li>
  </ul>
 </li>
 <li>
 Assign the Policies to the Secrets Manager user
  <ul>
   <li>Go to the <code>IAM</code> service, click <code>Users</code>, click the Secrets Manager user you created earlier</li>
   <li>Go to the <code>Permissions</code> section, click Add permission, select the Add permissions option</li>
   <li>In the Permissions options section, select the <code>Attach policies directly</code></li> option
   <li>Look for the two Policies created previously and select them</li>
   <li>Click Next, check if you selected correctly, click Add permissions</li>
  </ul>
 </li>
</ol>

<br/>
