/*
                                                  # COMO FUNCIONA ?

 -    'InputsControl' Precisa Ser Usado Com O Componente 'InputField', Sem o Componente 'InputField', 'InputsControl' Não Funciona.
                                           

 .. ESSE HELPER CONTERÁ VARIÁS FUNÇÕES, OBJETOS, VARIÁVEIS, ETC... QUE IRÃO AJUDAR A GERENCIAR OS INPUTS DO FORM 
 .. PARA USA-LO VOCÊ PRECISA CRIAR UMA VARIÁVEL COM VETOR DE OBJETOS, CONTENDO AS PROPRIEDADES DOS INPUTS QUE IRÃO SER 
 .. GERENCIADO, EX:  
  , const inputsFields = [
  ,  {
  ,     name: 's_nome_produtos',  
  ,  }
  , ]
  , <InputField
  ,   type="text"
  ,   id="s_nome_produtos" 
  , />
 .. A PROPRIEDADE OBRIGATORIA É APENÁS 'NAME' QUE IRÁ IDENTIFICAR O INPUT. OPCIONAIS, SÃO: 

  , --placeholder--; placeholder (txt),
  , --required--; required (true/false),
  , --autofocus--; autofocus (true/false),
  , --maxlength--; maxLength (num),
  , --className--; className (class),
  , --step--; step (num),
  , --icon--; icone design (<FaBoxes />),
  , --center--; centraliza o texto do input (true/false)
  , --labelText--; label input (txt),
  , --width--; largura do input (%),
  , --height--; altura do input (%),
  , --display--; formato de renderização do input (txt) (para inputs que contem um elemento pai, ex; div, span, etc... ),
  , --default_value--;  valor padrão do input. sempre que ter uma chamada pela função 'onReset()' o default_value será atribuido, e quando ser renderizado.
  , --margin--; margin ajustável, ou padronizado (px;true/false),
  , --divInputClass--; a classe adicional á 'div-input', quando o componente 'InputField', tem a propriedade 'icon'. apenas funciona para 'InputField'. (class)
  

  .. APÓS CRIAR O VETOR DE OBJETOS COM OS INPUTS, VOCÊ PRECISARÁ PASSAR 'inputsFields' COMO ARGUMENTO PARA A FUNÇÃO 'InputsControl'
  .. NO FORMATO DE OBJETO, NA PROPRIEDADE 'inputsFields', EX: 
  , const { onSubmit, inputsController, onReset } = InputsControl({
  ,  inputsFields: inputsFields,
  , })
  .. AS PROPRIEDADES OPCIONAIS, SÃO:

  , --submitFunction--; a função que será executada quando ocorrer o evento submit do form,
  , --submitArguments--; argumentos para a função submitFunction 

  .. 'InputsControl' RETORNARÁ ALGUMAS FUNÇÕES, OBJETOS, VARIÁVEIS, ELES SÃO:

  , --inputsController--; objeto irá ser passado para 'InputField',
  , --onChange--; função modifica os valores de inputsData, conforme o usuario digita nos inputs,
  , --onReset--; função  reset valores de inputsData,
  , --onSubmit--; função irá ser passada para 'onSubmit do form',
  , --configSubmit--; objeto config do onSubmit,
  , --inputsConfig--; objeto config dos inputs, 
  , --inputsData--; objeto valores dos inputs
  
  .. VOCÊ IRÁ PASSAR O 'RETORNADO inputsController' PARA O 'inputsController DO InputField'
  .. PARA 'inputsController' CONSEGUIR "REGISTRAR" O INPUT, EX:
  , <InputField
  ,   type="text"
  ,   id="s_fornecedor_produtos"
  ,   inputsController={inputsController}
  , />
  .. PARA CONECTAR UM EVENTO SUBMIT Á 'InputsControl', VOCÊ PRECISA PASSAR A FUNÇÃO PARA 'submitFunction'
  .. APÓS ISSO, VOCÊ CONSEGUIRÁ USAR 'onSubmit' QUE SERÁ RETORNADO PELA FUNÇÃO 'InputsControl'. APÓS ISSO,
  .. VOCÊ PRECISARÁ PASSAR O 'onSubmit RETORNADO' PARA A PROPRIEDADE 'onSubmit DO FORM', EX:
  , <form onSubmit={onSubmit}>

*/

//# Libs //
import { useState } from 'react'
import { Decimal } from 'decimal.js';
/*--------------*/

export default function InputsControl(
    RawControlObject
) {
    //# Variáveis, Objetos //

    const inputsDataScheme = register(RawControlObject, 'data')
    const inputsConfig = register(RawControlObject, 'config')
    const configSubmit = register(RawControlObject, 'submit')

    const [inputsData, setInputsData] = useState(inputsDataScheme)

    const ControlObject = {
        onReset: onReset,
        onChange: onChange,
        onSubmit: onSubmit,
        configSubmit: configSubmit,
        inputsConfig: inputsConfig,
        inputsData: inputsData,
        inputsController: {
            data: inputsData,
            onChange: onChange,
            onReset: onReset,
            config: inputsConfig
        },
    }

    //# Funções //

    //.. register //
    function register(object, type) {

        const vitalErrors =
            !object ? `;------- Error InputsControl object -------; Valor Vazio.`
                : !(object.constructor === Object && Object.getPrototypeOf(object) === Object.prototype)
                    ? ';------- Error InputsControl object -------; Não É Um Objeto.'
                    : !Array.isArray(object.inputsFields)
                        ? ';------- Error InputsControl inputsFields -------; Não É Um Array Ou Não Existe.'
                        : false
        if (vitalErrors) {
            console.error(vitalErrors)
            return
        }

        const Obj = {}
        if (type === 'config') {
            const inputsFields = object.inputsFields
            for (const inputField of inputsFields) {
                Obj[inputField.name] =
                {
                    placeholder: inputField.placeholder || undefined,
                    icon: inputField.icon || undefined,
                    maxlength: inputField.maxlength || undefined,
                    labelText: inputField.labelText || undefined,
                    margin: inputField.margin || false,
                    center: inputField.center || false,
                    width: inputField.width || undefined,
                    height: inputField.height || undefined,
                    default_value: inputField.default_value === 0 || inputField.default_value ? inputField.default_value : '',
                    display: inputField.display || undefined,
                    divInputClass: inputField.divInputClass || undefined,
                    className: inputField.className || '',
                    required: inputField.required === true ? true : false,
                    step: !isNaN(inputField.step) && inputField.step > 0 ? inputField.step : undefined,
                    autofocus: inputField.autofocus === true ? true : false
                }
            }
        }
        if (type === 'data') {
            const inputsFields = object.inputsFields
            for (const inputField of inputsFields) {
                Obj[inputField.name] = inputField.default_value || ''
            }
        }
        if (type === 'submit') {
            const submitFunction = object.submitFunction || undefined
            const submitArguments = object.submitArguments || []

            if (!(submitFunction instanceof Function)) {
                console.error(';------- Aviso InputsControl submitFunction -------; Não É Uma Função Ou Não Existe, Renderização Continuará.')
                return
            }

            Obj['submitArguments'] = submitArguments
            Obj['submitFunction'] = submitFunction
        }
        return Obj
    }

    //.. onReset //
    function onReset(fields) {
        if (!inputsData) {
            console.error(';------- Error InputsControl onReset -------; Objeto inputsData Não Existe.')
            return
        }
        if (fields) {
            setInputsData((prevFormData) => {
                const updatedData = { ...prevFormData };
                if (Array.isArray(fields)) {
                    fields.forEach((field) => {
                        updatedData[field] = inputsConfig[field].default_value || '';
                    });
                    return updatedData;
                }
                if (typeof fields === "string") {
                    updatedData[fields] = inputsConfig[fields].default_value
                    return updatedData;
                }
                console.log(`;------- Error InputsControl onReset -------; ${fields}, Não É Array Ou String`)
            });
            return
        }

        setInputsData(inputsDataScheme)
    }

    //.. onChange //
    function onChange(event, type) {
        const input = event.target;
        const name = input.name
        if (!name) {
            console.error(`;------- Error FormControl -------; Função onChange Não Foi Passado Nenhum Name, No Input ${input}.`)
            return
        }
        let value =
            type === 'file' ? input.files[0]
                : type === 'field' ? input.value
                    : type === 'radio' ? input.value
                        : type === 'date' ? input.value
                            : undefined
        
        if (value === undefined || value === null) {
            console.error(`;------- Error FormControl -------; Função onChange Argumento Type ${type} Inválido.`)
            return
        }
        console.log(inputsData)
        setInputsData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    //.. onSubmit //
    function onSubmit(event) {
        event.preventDefault()
        let inputKEYS = {
            keysCONFIG: Object.keys(inputsConfig),
            keysDATA: Object.keys(inputsData)
        }

        //.. inputConfig Verificações //
        const alertsMsgs = []
        for (let i = 0; i < inputsData.length; i++) {

            const InputName = inputKEYS.keysDATA[i]
            const InputValue = inputsData[InputName]

            //, step //
            const step = inputsConfig[InputName].step
            if (step !== null) {
                const decInputValue = new Decimal(InputValue.toString())
                const decStep = new Decimal(step.toString())
                if (!decInputValue.mod(decStep).isZero() || InputValue < 0) {
                    alertsMsgs.push(`${InputValue} Inválido`)
                }
            }
        }
        if (alertsMsgs.length !== 0) {
            for (const alertMsg of alertsMsgs) {
                alert(alertMsg)
            }
            return
        }
        if (configSubmit.submitFunction) {
            RawControlObject.submitFunction(inputsData, ...configSubmit.submitArguments)
        }
    }

    /*--------------*/

    //# Return InputsObject //

    return ControlObject

    /*--------------*/
}