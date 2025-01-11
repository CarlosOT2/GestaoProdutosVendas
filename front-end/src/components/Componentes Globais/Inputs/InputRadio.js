//# Componentes //
import TxtPadrão from "../Miscellaneous/TxtPadrão";
//# Classes //
import './InputRadio.scss'
/*--------------*/

export default function InputRadio(
    {
        labelText,
        className,
        onChange,
        value,
        inputsController, 
        name,
        id
    }
) {
    //# Verificações //

    const vitalError =
        !name ? `;------- Error InputRadio ${name} -------; Name É Obrigatório Em Todos Os Input Radio.`
            : !id ? `;------- Error InputRadio ${id} -------; ID É Obrigatório Em Todos Os Input Radio.`
                : null

    if (vitalError) {
        console.error(vitalError)
        return
    }
    if (!inputsController) {
        console.error(`;------- Error InputRadio ${id} Dos ${name}  -------; Aviso, Nenhum InputController Foi Recebido Como Parametro. A Renderização Continuará`)
    }
    
    /*--------------*/
    return (
        <>
            {
            //.. Label //
            }
            <label className='label-radio' htmlFor={id ? id : ''}>
                <input
                    type="radio"
                    id={id}
                    name={name}
                    value={value}
                    checked={(inputsController !== undefined ? inputsController.data[name] : '') === value}
                    className={className || ''}
                    onChange={inputsController !== undefined ? (event) => {
                        if (onChange) {
                            onChange()
                        }
                        if (inputsController.onChange) {
                            inputsController.onChange(event, 'radio')
                        }
                    } : () => { }}
                />
                <TxtPadrão type='span' texto={labelText} default_color={true} />
            </label>
            {/*--------------*/}
        </>
    )
}