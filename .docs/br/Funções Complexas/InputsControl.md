# InputsControl #
esse helper funciona apenas com o componente <i>InputField</i>, sem ele não irá funcionar.

<h3> Como usar </h3>
Usado para gerenciar os inputs de um form. para usa-lo você inicialmente criará um vetor de objetos. 
<br/> 
este vetor configurará os componentes InputFields, distinguindo cada item no vetor pela propriedade <i>name</i>, 
<br/> 
e os componentes pela propriedade <i>id</i>. é necessário que as propriedades name e id tenham o mesmo valor,
<br/> 
para poder configurar o inputField corretamente. exemplo;

<br/> 

```javascript
const inputsFields = [
  {
     name: 's_nome_produtos',  
  }
]
<form>
  <InputField
  type="text"
  id="s_nome_produtos" 
  />
</form>
```

Após criá-los, você passará o vetor para a função <i>InputsControl</i> no formato de um objeto dentro da propriedade <i>inputsFields</i>, exemplo;
```javascript
const { onSubmit, inputsController } = InputsControl({
  inputsFields: inputsFields
})
```
<i>InputsControl</i> retorna algumas funções essenciais. a função <i>inputsController</i> é passado
<br/>
para todos os InputFields por meio da sua propriedade chamada <i>inputsController</i>, essa função é responsável por controlar todos os InputsFields.
<br/>
a função <i>onSubmit</i> é passado para a propriedade onSubmit do form, esta função é responsável por controlar o Submit do form.

```javascript
<form onSubmit={onSubmit}>
  <InputField
    type="text"
    id="s_nome_produtos"
    inputsController={inputsController}
  />
</form>
```

para ligar uma função ao onSubmit, você passará a função para <i>InputsControl</i> através da propriedade <i>submitFunction</i>
```javascript
async function exampleFunc(data) {
  const produto_nome = data['s_nome_produtos']
}

const { onSubmit, inputsController, onReset } = InputsControl({
    inputsFields: inputsFields,
    submitFunction: exampleFunc
})
```
submitFunction passará como primeiro argumento para a função o objeto <i>inputsData</i>, que contém todos os dados do form.

<h2> Propriedades </h2>

<ul>
  <li>Vetor
    <ul>
      <li><b>name (string);</b> nome de identificação distintivo para o item do vetor</li>
      <li><b>placeholder (string);</b> propriedade placeholder do input</li>
      <li><b>required (boolean);</b> propriedade required do input</li>
      <li><b>autofocus (boolean);</b> propriedade autofocus do input</li>
      <li><b>maxlength (number);</b> propriedade maxlength do input</li>
      <li><b>className (string);</b> propriedade className do input</li>
      <li><b>step (number);</b> propriedade step do input</li>
      <li><b>icon;</b> icone adicionado ao input através de um componente</li>
      <li><b>center (boolean);</b> centraliza o texto do input</li>
      <li><b>labelText (string);</b> texto exibido do label</li>
      <li><b>width (percentage);</b> width do input</li>
      <li><b>height (percentage);</b> height do input</li>
      <li><b>display (string);</b> estilo display do input</li>
      <li><b>default_value (qualquer);</b> valor padrão do input</li>
      <li><b>margin (px) (boolean);</b> margin específica, ou padronizada</li>
      <li><b>divInputClass (string);</b> classe para <i>div-input</i>, elemento/div pai de <i>icon</i> quando a propriedade icon é verdadeira</li>
    </ul>
  </li>
  <li>Função InputsControl
    <ul>
      <li><b>submitFunction (function);</b> função executada ao ocorrer o evento Submit do form</li>
      <li><b>submitArguments (qualquer);</b> argumentos passados para a função de submitFunction</li>
    </ul>
  </li>
  <li>Funções e objetos retornados de InputsControl
    <ul>
      <li><b>inputsController (object);</b> objeto que controla todos os inputsFields</li>
      <li><b>onChange (function);</b> função que modifica inputsData conforme o usuário digita no formulário</li>
      <li><b>onReset (function);</b> função que reseta todos os dados de inputsData</li>
      <li><b>onSubmit (function);</b> função que controla o evento Submit do form</li>
      <li><b>configSubmit (object);</b> objeto que contém a configuração de onSubmit</li>
      <li><b>inputsConfig (object);</b> objeto que contém a configuração dos inputs</li>
      <li><b>inputsData (object);</b> objeto que contém os dados do formulário</li>
    </ul>
  </li>
</ul>
 
 
