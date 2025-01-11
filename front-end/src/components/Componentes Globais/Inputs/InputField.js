//# Componentes //
import Txt from "../Miscellaneous/TxtPadrão";
import IconComponent from "../Miscellaneous/IconComponent";
//# Libs //
import { useState } from 'react';
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';
//# Classes //
import './InputField.scss'
/*--------------*/

export default function InputContainer(props) {
  //# Props //

  /* eslint-disable */
  const {
    type,
    id,
    className,
    inputsController,
  } = props;

  /* eslint-enable */

  //# Funções //

  function handle_events(event) {
    set_input_events((prevEvents) => ({
      ...prevEvents,
      ...event,
    }));
  }

  //# Variáveis //

  const [input_events, set_input_events] = useState({
    hover: false,
    focus: false,
  })

  const input = {
    data: inputsController ? inputsController.data[id] : undefined,
    config: inputsController ? inputsController.config[id] : undefined,
    onChange: inputsController ? inputsController.onChange : undefined,
    events: { input_events, handle_events }
  }

  //# Verificações //

  const vitalError =
    !id
      ? `;------- Error InputField -------; ID É Obrigatório Em Todos Os InputField.`
      : !type
        ? `;------- Error InputField ${id} -------; Type É Obrigatório Em Todos Os InputField.`
        : type !== 'text' && type !== 'number' && type !== 'date'
          ? `;------- Error InputField ${id} -------; Type Inválido, Não Permitimos ${type}`
          : !input.config
            ? `;------- Error InputField ${id} -------; Input Não Registrado Em 'InputFields', Registre-o`
            : null

  if (vitalError) return console.error(vitalError)

  if (!inputsController) {
    console.error(`;------- Error InputField ${id} -------; Aviso, Nenhum InputController Foi Recebido Como Parametro. A Renderização Continuará`)
  }

  /*--------------*/
  return (
    <>
      {
        // .. Label //
      }
      {
        //, InputLabel //
        input.config.labelText ?
          <InputLabel
            {...props}
            labelText={input.config.labelText}
          />
          : null
      }
      {
        // .. Input Field //
      }
      {
        //, div-input (div-icon) //

        input.config.icon ?
          <>
            <div className={frmt(` 
          div-input 
          ${input.config.divInputClass || ''}
          `)}>
              {

                <>
                  <IconComponent
                    div_classes={`
                      div-input__div-icon
                      ${input_events.focus ? 'div-input__div-icon--focus' : ''}
                      ${input_events.hover ? 'div-input__div-icon--hover' : ''}
                        `}
                    Icon={input.config.icon}
                    div={true}
                  />
                  <InputField
                    {...props}
                    input={input}
                  />
                </>

              }
            </div>
          </>
          :
          <InputField
            {...props}
            input={input}
          />
      }
      {/*--------------*/}
    </>
  )
}
function InputField(props) {
  //# Props //

  const {
    type,
    id,
    className,
    input
  } = props;

  //# Style //

  const style = {
    width: `${input.config.width || ''}%`,
    height: `${input.config.height || ''}%`,
    margin: `${!isNaN(input.config.margin) ? input.config.margin : '0'}px`
  }

  //# Variáveis //

  const {
    input_events,
    handle_events
  } = input.events
  const {
    config,
    onChange,
    data
  } = input

  /*--------------*/
  return (
    //# Input //
    <input
      type={type}
      id={id}
      name={id}
      className={frmt(`
      input-field ${className || ''} 
      ${input_events.focus ? 'input-field--focus' : ''}
      ${input_events.hover ? 'input-field--hover' : ''}
      ${config.icon ? 'input-field--icon' : ''}  
      ${config.center ? 'input-field--center' : ''}
      ${config.margin === true && !config.icon ? 'input-field--margin' : ''}
      ${config.className || ''}
      `)}
      style={style}
      autoComplete="off"
      placeholder={config.placeholder || ''}
      required={config.required || false}
      autoFocus={config.autofocus || false}
      onFocus={() => handle_events({ focus: true })}
      onBlur={() => handle_events({ focus: false })}
      onMouseEnter={() => handle_events({ hover: true })}
      onMouseLeave={() => handle_events({ hover: false })}
      step={config.step || undefined}
      maxLength={config.maxlength || undefined}
      value={data || ''}
      onChange={(event) => {
        if (onChange !== undefined) {
          onChange(event, 'field')
        }
      }}
    />
    /*--------------*/
  )
}
function InputLabel(props) {
  //# Props //

  const {
    labelText,
    id
  } = props;

  /*--------------*/
  return (
    //# Label //
    <label className='label-input' htmlFor={id}>
      <Txt texto={labelText} default_color={true} type={'span'} />
    </label>
    /*--------------*/
  )
}