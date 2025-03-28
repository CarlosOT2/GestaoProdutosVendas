# Configurações Agendador De Tarefas #
<h3> Criando Tarefa Delete_LocalRoot </h3>

Tarefa que excluirá o arquivo `root.json` as credenciais do banco de dados armazenadas no diretório `back-end\data\local_credentials` após o desligamento do sistema operacional <b>(não funcionará se você usar o Power Button)</b>
<br/>
<br/>

1. Abra o aplicativo `Agendador de tarefas`, clique em `Criar Tarefa`, nomeie a tarefa para `Delete_LocalRoot`
2. Vá até `Ações`, crie uma nova Ação clicando em Novo, clique em Procurar, selecione o arquivo `delLocalRoot` no diretório `back-end\data\local_credentials`, clique em Ok
3. Vá até `Disparadores`, crie um novo Disparador clicando em Novo, selecione a opção `Em Um Evento` em `Iniciar a tarefa`
5. Selecione a opção `Personalizado`, clique em `Novo Filtro de Eventos...`, vá até a seção XML, selecione a opção `Editar consulta`, cole este código
<p>
<b>(Tenha cuidado com quebras de linha e espaços, a sintaxe é muito sensível)</b>
</p>
<pre><code>&lt;QueryList&gt;
  &lt;Query Id="0" Path="System"&gt;
    &lt;Select Path="System"&gt;
      *[System[EventID=1074]]
      and
      *[EventData[Data[@Name='param5'] and (Data='Desligado')]]
    &lt;/Select&gt;
  &lt;/Query&gt;
&lt;/QueryList&gt;
</code></pre>

7. Clique em Ok, Clique em Ok novamente
8. Vá até `Geral`, na seção `Opções de segurança` selecione a opção `Executar estando o usuário conectado ou não`
9. Finalize a criação da tarefa, clicando em Ok
