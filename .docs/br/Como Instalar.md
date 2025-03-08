# Como Instalar o Website #

<h3> Copiar a URL do Repositório </h3>

1. Vá até o repositório de GestãoProdutosVendas
2. Clique no botão "Code" (Código).
3. Copie a URL HTTPS ou SSH do repositório.

<h3> Clonar o Repositório com SSH </h3>

Caso não saiba o que seja SSH, [Como Se Conectar No Github Com SSH](https://docs.github.com/pt/authentication/connecting-to-github-with-ssh)
<br/>
<br/>

1. No git bash, navegue até o diretório onde deseja salvar o repositório
2. Copie a URL SSH do repositório
3. Execute o comando `git clone git@github.com:usuario_nome/repo_nome.git`

<h3> Clonar o Repositório com HTTPS </h3>

1. No git bash, navegue até o diretório onde deseja salvar o repositório
2. Copie a URL HTTPS do repositório
3. Execute o comando `git clone https://github.com/usuario/repo.git`

<h3> Configurando O Back-End </h3>

1. No terminal vá até o diretório de GestãoProdutosVendas
2. Execute o comando `npm i`, no diretório back-end
3. Após isso vá até o diretório `back-end\config`
4. No arquivo `users_win.js` altere server para o nome do usuário que irá utilizar o website
5. No arquivo `aws.js` altere credentials_path para o caminho do arquivo das credenciais do aws


<h3> Configurando O Front-End </h3>

1. No terminal vá até o diretório de GestãoProdutosVendas
2. Execute o comando `npm i`, no diretório front-end
3. Caso esteja usando uma URL distinta, vá até `src\config`, altere o arquivo `config_websv.js` para a sua URL

<h3> Configurando O Agendador De Tarefas </h3>

1. Abra o aplicativo `agendador de tarefas`, Clique em `Criar Tarefa` na seção Ações, Nomeie a tarefa para `Delete_LocalRoot`
2. Vá até `Ações` na aba Criar Tarefa, crie uma nova Ação clicando em Novo, clique em Procurar, selecione o arquivo `delLocalRoot` no diretório `back-end\data\local_credentials`, clique em Ok
3. Vá até `Disparadores` na aba Criar Tarefa, clique em Novo
4. Selecione a opção `Em Um Evento` em `Iniciar a tarefa`
5. Selecione a opção Personalizado, clique em Novo Filtro de Eventos...
6. Vá até a seção XML, selecione a opção Editar consulta, cole este código (Tenha cuidado com quebras de linha e espaços, a sintaxe é muito sensível)
<pre><code>
&lt;QueryList&gt;
  &lt;Query Id="0" Path="System"&gt;
    &lt;Select Path="System"&gt;
      *[System[EventID=1074]]
      and
      *[EventData[Data[@Name='param5'] and (Data='Desligado')]]
    &lt;/Select&gt;
  &lt;/Query&gt;
&lt;/QueryList&gt;
</code></pre>
7. Clique em Ok, e Ok
8. Vá até `Geral` na aba Criar Tarefa, na seção `Opções de segurança` selecione a opção `Executar estando o usuário conectado ou não`





