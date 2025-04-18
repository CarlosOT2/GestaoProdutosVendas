# List #
<h3> Usage </h3>
This component will be used to display a list of various data, including functionalities such as removal, update, addition, and more.


<h2> Component properties </h2>

<ul>
  <li>tHeadTh
    <ul>
      <li>The head of the list, will read an array in a specific format, rendering each element of the array in ascending order, for example:
      <pre>const tHeadTh = [
{ innerText: 'Cód', id: 'thCod' }, 
{ innerText: 'Nome', className: 'th-head' },
{ innerText: 'Ações', className: 'th-head--acões' } 
]</pre>
      </li>
      <li>
      Properties:
      <ul>
        <li><b>innerText (string);</b> displayed text</li>
        <li><b>className (string);</b> his class</li>
        <li><b>id (string);</b> the property of th, id</li>
      </ul>
      </li>
    </ul>
  </li>
  <li>tBodyTd
     <ul>
        <li>Defines each data item displayed in the list, which can be customized in different ways, for example:
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
       Properties:
          <ul>
            <li><b>column (string);</b> name of the column/key to be displayed</li>
            <li><b>className (string);</b> his class</li>
            <li><b>title (string);</b> his title</li>
            <li><b>img (boolean);</b> if the data is a link to an image. example: http://localhost:3000/imagens/no-image-icon.png</li>
            <li><b>date (boolean);</b> if the data is a date</li>
            <li><b>cash (boolean);</b> if the data is monetary</li>
            <li><b>percentage (boolean);</b> if the data is a percentage</li>
            <li>
            <b>desconto (string);</b> Applies a discount to the data, using another column/key, which will contain discount percentage to be applied to the data.
            Both values — the discounted value and the discount percentage — must be numeric. Example: 'i_desconto_produtos', containing the value 93
            </li>
          </ul>
       </li>
     </ul>
  </li>
  <li>tBodyTr
     <ul>
       <li>
       Represents the rows in the table. to distinguish each row, we're using a specific column that contains different values ​among all records. example:
       <pre>const tBodyTr = {
key: 'i_id_produtos'
}</pre>
       </li>
       <li>
       Properties:
          <ul>
            <li><b>key (string);</b> column/key that distinguishes the row from all others in the table</li>
            <li><b>className (string);</b> his class</li>
          </ul>
       </li>
     </ul>
  </li>
  <li>Records
     <ul>
       <li>
       The data in the list needs to be in a specific format to be displayed correctly.
       </li>
       <li>
       The format is the same as when we get records from a database table. example:
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
  <li>Route
     <ul>
       <li>
       Default route for all actions requests, such as actionDel, actionAdd, actionAlt, if no route is specified. example: 'produtos'
       </li>
     </ul>
  </li>
  <li>actionDel
     <ul>
       <li>
      Remove a line from the list, directly affecting the database. To use it provide an object with the message to be displayed. Example:
      <pre>actionDel={{ 
title: 'Excluir Produtos', 
message: 'Tem Certeza? O Produto Não Poderá Ser Mais Consultado, Após Deleta-lo.' 
}}</pre>
       </li>
       <li>
       Properties:
          <ul>
            <li><b>message (string);</b> message displayed on removal</li>
            <li><b>title (string);</b> the attribute title on HTML, displayed when you hover the mouse over action</li>
            <li><b>Rota (string);</b> route that'll be used to perform the removal request</li>
          </ul>
       </li>
     </ul>
  </li>
  <li>actionAlt
  <ul>
       <li>
      It allows modification of data, which directly affects database by modifying the database records. Example:
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
       Properties:
          <ul>
            <li><b>column (string);</b> name of the column/key that'll be allowed to be modified. example: 's_nome_produtos'</li>
            <li><b>prompt (string);</b> message displayed during modification to the new value</li>
            <li><b>Rota (string);</b>  route that'll be used to perform the modification request</li>
            <li><b>type (string);</b> it'll verify the new value. to use type the keyword in the property, keywords are:
              <ul>
                <li><b>string;</b> Allows only strings less than 255 characters</li>
                <li><b>int;</b> Allows only integers, equal to or above 0</li>
                <li><b>cash;</b> Allow only numbers above 0.01 and less than 999999.99</li>
                <li><b>perc;</b> Allows only integers from 0 to 100</li>
              </ul>
            </li>
          </ul>
       </li>
     </ul>
  </li>
  <li>actionAdd
  <ul>
       <li>
       Perform a request to add new records in other tables. example:
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
       Properties:
          <ul>
            <li><b>Rota (string);</b> route that'll be used to perform the addition request</li>
            <li><b>title (string);</b> his title</li>
            <li><b>type (object);</b> Will perform verifications before addition and side-effects after addition
              <ul>
                <li><b>name (string);</b> define the verification and side-effect. to define it type the keyword in the property, keywords are:
                  <ul>
                    <li><b>sales;</b> subtract a numerical value from a column, requiring you configure the column and value. the addiction will only be performed if the column value is not zero and is above zero. furthermore, if the result of subtraction is less than zero, the addiction will not be performed either
                    </li>
                  </ul>
                </li>
                <li><b>rota (string);</b> route that'll be used to perform the side-effect</li>
                <li><b>column (object);</b> configure the columns. to configure it, choose correct property for your <i>name</i> below and type the name of the column
                  <ul>
                    <li><b>storage_value (string) (sales);</b> decide subtracted column</li>
                  </ul>
                </li>
                <li><b>data (object);</b> configure using <i>data</i> property. to configure it, choose correct property for your <i>name</i> below and type the name of the data column
                  <ul>
                    <li><b>quantity_sales (string) (sales);</b> decide subtracted value, using a specific value of the column/key in <i>data</i> property</li>
                  </ul>
                </li>
                <li><b>error_message (object);</b> message displayed if verification is not successful
                  <ul>
                    <li><b>storage_value (string) (sales);</b> message displayed if column verification fails</li>
                    <li><b>quantity_sales (string) (sales);</b> message displayed if result verification fails</li>
                  </ul>
                </li>
              </ul>
            </li>
            <li><b>data (object);</b>
            defines addition values ​​of a new record. this property will be converted to JSON and sent to the API. each key-value pair of property will be included in the request body, with values adjusted according to configuration. the configurations are:
              <ul> 
                <li><b>column (string);</b> use a column from the list as the value (column of the list row that was requested to be added)</li>
                <li><b>value (any);</b> use any value. example; functions, strings, objects...</li>
                <li><b>prompt (object);</b> uses the value given by the user through prompt
                  <ul>
                    <li><b>message (string);</b> message displayed in the prompt</li>
                    <li><b>cancel (string) (optional);</b> value typed by the user to cancel prompt and addition</li>
                  </ul>
                </li>
                <li><b>config_value (object);</b> functionalities that can be applied to the value
                  <ul>
                    <li><b>default (any/object);</b> 
                    default value if value is empty (it is applied in the prompt)
                      <ul> 
                        <li><b>column (string);</b> use a column from the list itself as default value</li>
                      </ul>
                    </li>
                    <li><b>desconto (string);</b> use the value to apply a discount to another column
                      <ul>
                        <li><b>column (string);</b> defines in which column the discount will be applied</li>
                      </ul>
                    </li>
                    <li><b>verify (object);</b> it'll verify the value before performing the addition. if verification is not successful, the addition will not be performed
                      <ul>
                        <li><b>type (string);</b> configure the verification. to configure it type the keyword in the property, keywords are:
                          <ul>
                            <li><b>int;</b> allows only integers</li>
                          </ul>
                        </li>
                        <li><b>max (number);</b> used only in <i>int</i>, defines maximum allowed value</li>
                        <li><b>min (number);</b> used only in <i>int</i>, defines minimum allowed value</li>
                        <li><b>error_message (string) (optional);</b> message displayed if verification is not successful </li>
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
