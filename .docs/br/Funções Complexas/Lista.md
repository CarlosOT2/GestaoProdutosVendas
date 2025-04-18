# Lista #
<h3> Utilização </h3>
Esse componente será utilizado para exibir uma lista de dados diversos, contendo algumas funcionalidades como remoção, alteração, adição, entre outros.

<h2> Propriedades do componente </h2>

<ul>
  <li>tHeadTh
    <ul>
      <li>O head da lista, lerá um array em um formato específico. renderizando cada elemento do array em ordem crescente, exemplo:
      <pre>const tHeadTh = [
{ innerText: 'Cód', id: 'thCod' }, 
{ innerText: 'Nome', className: 'th-head' },
{ innerText: 'Ações', className: 'th-head--acões' } 
]</pre>
      </li>
      <li>
      Propriedades:
      <ul>
        <li><b>innerText (string);</b> texto exibido</li>
        <li><b>className (string);</b> a sua classe</li>
        <li><b>id (string);</b> a propriedade do th, id</li>
      </ul>
      </li>
    </ul>
  </li>
  <li>tBodyTd
     <ul>
        <li>Define cada dado exibido na lista, que pode ser personalizado de diferentes maneiras, exemplo:
        <pre>const tBodyTd = [
{
  column: 'i_id_produtos',
  className: 'tr-produtos__td-body-id'
},
{
  column: 's_nome_produtos',
  className: 'tr-produtos__td-body-nome',
  title: 'Alterar Nome'
},
{
  column: 's_fornecedor_produtos',
  className: 'tr-produtos__td-body-fornecedor',
  title: 'Alterar Fornecedor'
}
]</pre>
       </li> 
       <li>
       Propriedades:
          <ul>
            <li><b>column (string);</b> nome da chave de coluna/chave a ser exibida</li>
            <li><b>className (string);</b> a sua classe</li>
            <li><b>title (string);</b> o seu title</li>
            <li><b>img (boolean);</b> caso o dado contido for um link de uma imagem. exemplo do link; http://localhost:3000/imagens/no-image-icon.png</li>
            <li><b>date (boolean);</b> caso o dado for uma data</li>
            <li><b>cash (boolean);</b> caso o dado for monetário</li>
            <li><b>percentage (boolean);</b> caso o dado for uma porcentagem</li>
            <li>
            <b>desconto (string);</b> Aplica um desconto ao dado, usando outra coluna/chave que será a porcentagem de desconto aplicada ao dado.
            Ambos os valores — o valor descontado e o percentual de desconto — devem ser numéricos. Exemplo: 'i_desconto_produtos', contendo o valor 93
            </li>
          </ul>
       </li>
     </ul>
  </li>
  <li>tBodyTr
     <ul>
       <li>
       Representa as linhas na tabela. Para distinguir cada linha, usamos uma coluna específica que conterá valores diferentes entre todos os registros. exemplo:
       <pre>const tBodyTr = {
key: 'i_id_produtos'
}</pre>
       </li>
       <li>
       Propriedades:
          <ul>
            <li><b>key (string);</b> coluna/chave que distingue a linha de todas na tabela</li>
            <li><b>className (string);</b> a sua classe</li>
          </ul>
       </li>
     </ul>
  </li>
  <li>Registros
     <ul>
       <li>
       Os dados da lista precisam está em um formato específico para conseguir ser exibido corretamente
       </li>
       <li>
       O formato seria o mesmo de quando recuperamos os registros de uma tabela de um banco de dados. exemplo:
       <pre>[{
i_id_produtos: 1,
s_nome_produtos: exemplo1,
s_fornecedor_produtos: fornecedor1,
f_valor_produtos: 10
},
                                {
i_id_produtos: 2,
s_nome_produtos: exemplo2,
s_fornecedor_produtos: fornecedor2,
f_valor_produtos: 12
}]     </pre>
       </li>
     </ul>
  </li>
  <li>Rota
     <ul>
       <li>
       Rota padrão para todas as requisições das ações, como actionDel, actionAdd, actionAlt, se nenhuma rota for especificada esta será a rota. exemplo: 'produtos'
       </li>
     </ul>
  </li>
  <li>actionDel
     <ul>
       <li>
      Remove uma linha da lista, afetando diretamente o banco de dados. para usa-lo basta fornecer um objeto com a messagem a ser exibida. exemplo:
      <pre>actionDel={{ 
title: 'Excluir Produtos', 
message: 'Tem Certeza? O Produto Não Poderá Ser Mais Consultado, Após Deleta-lo.' 
}}</pre>
       </li>
       <li>
       Propriedades:
          <ul>
            <li><b>message (string);</b> a mensagem exibida na hora da remoção</li>
            <li><b>title (string);</b> o atributo title HTML, exibido quando você passa o mouse sobre a ação</li>
            <li><b>Rota (string);</b> a rota que será usada para realizar a requisição de remoção</li>
          </ul>
       </li>
     </ul>
  </li>
  <li>actionAlt
  <ul>
       <li>
      Permite a alteração dos dados , que afeta diretamente o banco de dados, alterando os registro do banco de dados. exemplo:
      <pre>actionAlt={{
  props: [
  { column: 's_nome_produtos', prompt: 'Digite o Novo Nome:', type: 'string' },
  { column: 's_fornecedor_produtos', prompt: 'Digite O Novo Fornecedor:', type: 'string' },
  { column: 'f_valor_produtos', prompt: 'Digite o Novo Preço:', type: 'cash' },
  { column: 'f_valorFornecedor_produtos', prompt: 'Digite o Novo Preço De Fábrica:', type: 'cash' },
  { column: 'i_estoque_produtos', prompt: 'Digite A Nova Quantidade De Produtos:', type: 'int' },
  { column: 'i_desconto_produtos', prompt: 'Digite O Novo Desconto:', type: 'perc' },
  ]
}}</pre>
       </li>
       <li>
       Propriedades:
          <ul>
            <li><b>column (string);</b> o nome da coluna/chave que será permitido a alteração. exemplo: 's_nome_produtos'</li>
            <li><b>prompt (string);</b> a mensagem exibida durante a alteração para o novo valor</li>
            <li><b>Rota (string);</b> a rota que será usada para realizar a requisição de alteração</li>
            <li><b>type (string);</b> irá validar o novo valor. para usar basta digitar a palavra-chave na propriedade, as palavras-chave são:
              <ul>
                <li><b>string;</b> permite apenas strings de até 255 caracteres</li>
                <li><b>int;</b> permite apenas números inteiros, igual/acima de 0</li>
                <li><b>cash;</b> permite apenas números acima de 0.01 e abaixo de 999999.99</li>
                <li><b>perc;</b> permite apenas números inteiros de 0 á 100</li>
              </ul>
            </li>
          </ul>
       </li>
     </ul>
  </li>
  <li>actionAdd
  <ul>
       <li>
       Realiza uma requisição de adição de novos registros em outras tabelas. exemplo:
       <pre>
actionAdd={{
Rota: 'vendas',
title: 'Adicionar Vendas',
type: {
  name: 'sales',
  rota: 'produtos',
  column: { storage_value: 'i_estoque_produtos' },
  data: { quantity_sales: 'i_quantidade_vendas' },
  error_message: {
    storage_value: 'Estoque Igual Á 0 Ou Menor; Impossível Adicionar Novas Vendas',
    quantity_sales: 'Quantidade Vendas Inválida; Ultrapassou Estoque'
  }
},
data: {
  s_nome_vendas: { column: 's_nome_produtos' },
  s_fornecedor_vendas: { column: 's_fornecedor_produtos' },
  f_valor_vendas: { column: 'f_valor_produtos' },
  f_valorFornecedor_vendas: { column: 'f_valorFornecedor_produtos' },
  d_data_vendas: { value: CurrentDate() },
  i_quantidade_vendas: {
    prompt: { message: `Quantidade Específica? (Digite -1 Para Cancelar)`, cancel: '-1' },
    config_value: {
      default: 1,
      verify: {
        type: 'int',
        max: 100,
        min: 1,
        error_message: 'Quantidade Inválida; Entre 1 á 100'
      }
    }
  },
  i_desconto_vendas: {
    prompt: { message: `Desconto Específico? (Digite -1 Para Cancelar)`, cancel: '-1' },
    config_value: {
      desconto: 'f_valor_vendas',
      default: { column: 'i_desconto_produtos' },
      verify: {
        type: 'int',
        max: 100,
        min: 0,
        error_message: 'Desconto Inválido; Entre 0 á 100'
      }
    }
  },
 }
}}
       </pre>
       </li>
       <li>
       Propriedades:
          <ul>
            <li><b>Rota (string);</b> a rota que será usada para realizar a requisição de adição</li>
            <li><b>title (string);</b> o seu title</li>
            <li><b>type (object);</b> fará verificações antes da adição e efeitos colaterais após a adição
              <ul>
                <li><b>name (string);</b> define a verificação e efeito colateral que será realizado. para usar basta digitar a palavra-chave na propriedade, as palavras-chave são:
                  <ul>
                    <li><b>sales;</b> subtrai um valor numérico de uma coluna, sendo necessário configurar a coluna e o valor. a adição só é realizada se o valor da coluna for diferente de zero e maior que zero. Além disso, se o resultado da subtração for menor que zero, a adição também não será realizada
                    </li>
                  </ul>
                </li>
                <li><b>rota (string);</b> a rota que será efetuado o efeito colateral</li>
                <li><b>column (object);</b> configura as colunas. para configurar, escolha a propriedade correta para o seu <i>name</i> abaixo e escreva o nome da coluna
                  <ul>
                    <li><b>storage_value (string) (sales);</b> define a coluna subtraída</li>
                  </ul>
                </li>
                <li><b>data (object);</b> configura usando da propriedade <i>data</i>. para configurar, escolha a propriedade correta para o seu <i>name</i> abaixo e escreva o nome da coluna de data
                  <ul>
                    <li><b>quantity_sales (string) (sales);</b> define o valor subtraído, usando o valor de uma coluna específica na propriedade <i>data</i></li>
                  </ul>
                </li>
                <li><b>error_message (object);</b> mensagem exibida se a verificação não for bem-sucedida
                  <ul>
                    <li><b>storage_value (string) (sales);</b> a mensagem se a verificação da coluna falhar</li>
                    <li><b>quantity_sales (string) (sales);</b> a mensagem se a verificação do resultado falhar</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><b>data (object);</b> 
            irá definir os valores da adição de um novo registro. esta propriedade será convertida em JSON e enviado à API. cada chave-valor da propriedade será incluído no corpo da requisição, com os valores ajustados conforme a configuração. as configurações possíveis são;
              <ul>
                <li><b>column (string);</b> usa uma coluna da própria lista como valor (coluna do item que foi solicitado a adição)</li>
                <li><b>value (qualquer);</b> usa qualquer valor. ex; funções, strings, objetos, etc</li>
                <li><b>prompt (object);</b> usa o valor definido pelo usuário por meio do prompt
                  <ul>
                    <li><b>message (string);</b> mensagem exibida no prompt</li>
                    <li><b>cancel (string) (opcional);</b> valor digitado pelo usuário para cancelar o prompt e a adição</li>
                  </ul>
                </li>
                <li><b>config_value (object);</b> funcionalidades que podem ser aplicadas ao valor
                  <ul>
                    <li><b>default (qualquer/object);</b> 
                    valor padrão se o valor for vazio (ele é aplicado no prompt)
                      <ul>
                        <li><b>column (string);</b> usa uma coluna da própria lista como valor padrão</li>
                      </ul>
                    </li>
                    <li><b>desconto (string);</b> usará o valor para aplicar um desconto a outra coluna 
                      <ul>
                        <li><b>column (string);</b> define em qual coluna o desconto será aplicado</li>
                      </ul>
                    </li>
                    <li><b>verify (object);</b> verifica o valor antes de realizar a adição. se a verificação não for bem-sucedida, a adição não será realizada
                      <ul>
                        <li><b>type (string);</b> configura a verificação. para configurar digite a palavra-chave na propriedade, as palavras-chave são:
                          <ul>
                            <li><b>int;</b> permite apenas números inteiros</li>
                          </ul>
                        </li>
                        <li><b>max (number);</b> usado somente em <i>int</i>, define o valor máximo permitido</li>
                        <li><b>min (number);</b> usado somente em <i>int</i>, define o valor mínimo permitido</li>
                        <li><b>error_message (string) (opcional);</b> mensagem exibida se a verificação não for bem-sucedida </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
       </li>
     </ul>
  </li>
</ul>

