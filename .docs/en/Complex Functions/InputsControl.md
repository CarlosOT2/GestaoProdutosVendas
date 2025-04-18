# InputsControl #
this helper only works with the component <i>InputField</i>, it'll not work without it.


<h3> How to use </h3>
Used to manage inputs of a form. to use it, you'll initially create a objects array.
<br/>
this array will configure the components InputFields, distinguishing each item in the array by property <i>name</i>,
<br/>
and the components by property <i>id</i>. name and id properties must have same value,
<br/> 
to properly configure the inputField. example;

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
After creating them, you'll pass the array to the <i>InputsControl</i> function in format of an object within the <i>inputsFields</i> property, example:

```javascript
const { onSubmit, inputsController } = InputsControl({
  inputsFields: inputsFields
})
```

<i>InputsControl</i> returns some essential functions. the <i>inputsController</i> function is passed
<br/>
to all InputFields through their <i>inputsController</i> prop, this function is responsible for controlling all InputFields.
<br/>
the <i>onSubmit</i> function is passed to the form onSubmit prop. this function is responsible for handling the form submit.
```javascript
<form onSubmit={onSubmit}>
  <InputField
    type="text"
    id="s_nome_produtos"
    inputsController={inputsController}
  />
</form>
```

to link a function to onSubmit, you'll pass the function to <i>InputsControl</i> through the <i>submitFunction</i> prop
```javascript
async function exampleFunc(data) {
  const produto_nome = data['s_nome_produtos']
}

const { onSubmit, inputsController, onReset } = InputsControl({
    inputsFields: inputsFields,
    submitFunction: exampleFunc
})
```
submitFunction will pass the <i>inputsData</i> object as first argument to the function, which contains all the form data.

<h2> Properties </h2>

<ul>
  <li>Array
    <ul>
      <li><b>name (string);</b> identifier name for the array item</li>
      <li><b>placeholder (string);</b> input placeholder property</li>
      <li><b>required (boolean);</b> input required property</li>
      <li><b>autofocus (boolean);</b> input autofocus property</li>
      <li><b>maxlength (number);</b> input maxlength property</li>
      <li><b>className (string);</b> input className property</li>
      <li><b>step (number);</b> input step property</li>
      <li><b>icon;</b> icon added to input through a component</li>
      <li><b>center (boolean);</b> centers input text</li>
      <li><b>labelText (string);</b> label displayed text</li>
      <li><b>width (percentage);</b> input width</li>
      <li><b>height (percentage);</b> input height</li>
      <li><b>display (string);</b> input display style</li>
      <li><b>default_value (any);</b> input default value</li>
      <li><b>margin (px) (boolean);</b> specific margin or default margin</li>
      <li><b>divInputClass (string);</b> className for <i>div-input</i>, father div/element of <i>icon</i>, when the icon property is true</li>
    </ul>
  </li>
  <li>Function InputsControl
    <ul>
      <li><b>submitFunction (function);</b> function executed when the form Submit event occurs</li>
      <li><b>submitArguments (any);</b> arguments given to the submitFunction function</li>
    </ul>
  </li>
  <li>Functions and objects returned from InputsControl
    <ul>
      <li><b>inputsController (object);</b> object that controls all inputsFields</li>
      <li><b>onChange (function);</b> function that modifies inputsData as user types in the form</li>
      <li><b>onReset (function);</b> function that reset all inputsData data</li>
      <li><b>onSubmit (function);</b> function that handle the form Submit event</li>
      <li><b>configSubmit (object);</b> object that contain onSubmit config</li>
      <li><b>inputsConfig (object);</b> object that contain inputs config</li>
      <li><b>inputsData (object);</b> object that contain the form data</li>
    </ul>
  </li>
</ul>