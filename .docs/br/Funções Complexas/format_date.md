# format_date #

<h3> Utilização </h3>
Usado para formatar diferentes tipos de datas, para diversos formatos.
</br>


<h2> Funções </h2>

<ul>
    <li><b>format_StringDate;</b> usado para formatar datas com o formato <i>'Y0000M00D00'</i>, iguais ou maiores que '0100-01-01'. ele recebe um objeto contendo as datas, retornando as datas após a formatação.
      <ul> 
        <li><b>Propriedades:</b>
          <ul>
            <li><b>type (string);</b> especifica em qual formato a data será formatada (exemplo utilizado; 'Y1231M00D01')
              <ul>
                <li><b>object;</b> { year: 1231, month: undefined, day: 01 }</li>
                <li><b>standard;</b> 1231-00-02</li>
              </ul>
            </li>
            <li><b>verify (boolean);</b> verifica a data de acordo com as regras do MySQL</li>
            <li><b>date (string);</b> o objeto contendo as datas</li>
          </ul>
        </li>
      </ul>
    </li>   
    <li><b>format_ISO8601;</b> usado para formatar datas ISO8601. ele recebe um objeto contendo a data a ser formatada. 
    </br>
    ele não retorna nenhum valor. ex; <code>await format_ISO8601({ row: current_row, date_format: 'yyyy/MM/dd', date_column: column })</code>
      <ul> 
        <li><b>Propriedades:</b>
          <ul>
            <li><b>row (object);</b> o objeto que contém a data a ser formatada</li>
            <li><b>date_format (string);</b> o formato novo da data</li>
            <li><b>date_column (string);</b> o nome da chave que contém a data a ser formatada</li>
          </ul>
        </li>
      </ul>
    </li> 
    <li><b>formatTable_Date;</b> usado para formatar simultaneamente datas ISO8601. ele recebe um array de objetos, em cada objeto contém a data a ser formatada. 
    </br>
    ele não retorna nenhum valor. ex; <code>await formatTable_Date(vendas, 'd_data_vendas')</code>
      <ul> 
        <li><b>Parâmetros:</b>
          <ul>
            <li><b>table_data (array);</b> o array de objetos que contém a data</li>
            <li><b>column (string);</b> o nome da chave que contém a data, usado em todos os objetos. <b>AVISO; o nome da chave deve ser idêntico a todos os objetos</b></li>
          </ul>
        </li>
      </ul>
    </li> 
</ul>
                                               