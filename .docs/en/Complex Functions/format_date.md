# format_date #

<h3> Usage </h3>
Used to format different types of dates into various formats.
</br>


<h2> Functions </h2>

<ul>
    <li><b>format_StringDate;</b> 
    used to format dates into the format <i>'Y0000M00D00'</i>, equal to or above '0100-01-01'. it receives an object containing dates and returns the dates after formatting it.
      <ul> 
        <li><b>Properties:</b>
          <ul>
            <li><b>type (string);</b> specifies in which format the date will be formatted (example used; 'Y1231M00D01')
              <ul>
                <li><b>object;</b> { year: 1231, month: undefined, day: 01 }</li>
                <li><b>standard;</b> 1231-00-02</li>
              </ul>
            </li> 
            <li><b>verify (boolean);</b> verify the date according to MySQL rules</li>
            <li><b>date (string);</b> object containing the dates</li>
          </ul>
        </li>
      </ul>
    </li>   
    <li><b>format_ISO8601;</b> used to format ISO8601 dates. it receives an object containing the date to be formatted.
    </br>
    it doesn't return any value. example; <code>await format_ISO8601({ row: current_row, date_format: 'yyyy/MM/dd', date_column: column })</code>
      <ul> 
        <li><b>Properties:</b>
          <ul>
            <li><b>row (object);</b> object that contain the date to be formatted</li>
            <li><b>date_format (string);</b> new date format</li>
            <li><b>date_column (string);</b> key name that contains the date to be formatted</li>
          </ul>
        </li>
      </ul>
    </li> 
    <li><b>formatTable_Date;</b> used to simultaneously format ISO8601 dates. it receives an objects array, each object contains the date to be formatted. 
    </br>
    it doesn't return any value. example; <code>await formatTable_Date(vendas, 'd_data_vendas')</code>
      <ul> 
        <li><b>Parameters:</b>
          <ul>
            <li><b>table_data (array);</b> objects array that contains the date</li>
            <li>
              <b>column (string);</b> key name that contains the date, used in all objects. <b>WARNING; key name must be the same in all objects</b>
            </li>
          </ul>
        </li>
      </ul>
    </li> 
</ul>
                       