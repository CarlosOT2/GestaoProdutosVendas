# How To Install #

<h3> Copy Repository URL </h3>

1. Access GestãoProdutosVendas repository
2. Click Code button.
3. Copy the HTTPS or SSH URL from the repository.

<h3> Clone the repository using SSH </h3>

If you don't know what SSH is, [How to Connect to Github with SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

1. Open git bash, go to the directory where you want to clone the repository
2. Copy the SSH URL from the repository
3. Run command `git clone git@github.com:username/repository.git`
   
<h3> Clone the repository using HTTPS </h3>

1. Open git bash, go to the directory where you want to clone the repository
2. Copy the HTTPS URL from the repository
3. Run command `git clone https://github.com/username/repository.git`
<br/>

<h3> How to Configure the Back-End </h3>

1. In the terminal, go to the directory `GestãoProdutosVendas/back-end` and run the command `npm i`
2. Open the app `HeidiSQL` for the database `MariaDB` and run query `CREATE DATABASE db_gestaoprodutosvendas`
3. Go to data directory, usually located at <code>User\MariaDB\data</code>, open the file <code>my.ini</code> and in the [mysqld] section, add following configuration: <code>lc_time_names=pt_BR</code>
4. After that, you'll need to configure AWS [AWS Basic Settings](./AWS%20Basic%20Settings.md)
5. In the terminal again, go to the directory `GestãoProdutosVendas/back-end` and run command `npm run migrate:latest --env prod`
6.  Go to the directory `back-end\config`, in file `users_win.js` change server to the name of the Windows User who'll use the website

<h3> How to Configure the Front-End </h3>

1. Open terminal, go to the `GestãoProdutosVendas/front-end` directory and run command `npm i`
2. If you're using a custom URL, go to `src\config` and change the variable `WebService` from file `config_websv.js` to your URL
<br/>

<h3> How to Configure Task Scheduler </h3>

Configuring Task Scheduler is recommended but optional, you don’t need it for your website to work. It will offer extra security [Task Scheduler Settings](./Task%20Scheduler%20Settings.md)

