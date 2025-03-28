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

1. Open terminal, go to the `GestãoProdutosVendas/back-end` directory and run command `npm i`
2. Open `HeidiSQL` app from `MariaDB` and run query `CREATE DATABASE db_gestaoprodutosvendas`
3. Open terminal again, go to the `GestãoProdutosVendas/back-end` directory, run command `npm run migrate:latest --env prod`
4. After that, go to the `back-end\config` directory
5. Open file `users_win.js`, change server to the name of the Windows User who will use the website
6. After that, you will have to configure AWS [AWS Basic Settings](./AWS%20Basic%20Settings.md)

<h3> How to Configure the Front-End </h3>

1. Open terminal, go to the `GestãoProdutosVendas/front-end` directory and run command `npm i`
2. If you're using a custom URL, go to `src\config` and change the variable `WebService` from file `config_websv.js` to your URL
<br/>

<h3> How to Configure Task Scheduler </h3>

Configuring Task Scheduler is recommended but optional, you don’t need it for your website to work. It will offer extra security [Task Scheduler Settings](./Task%20Scheduler%20Settings.md)

