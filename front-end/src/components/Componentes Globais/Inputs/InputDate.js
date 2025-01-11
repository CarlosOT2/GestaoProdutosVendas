//# Componentes //
import TxtPadrão from "../Miscellaneous/TxtPadrão";
//# Libs //
import { useState } from 'react'
//# Classes //
import './InputDate.scss'
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';
import { FormatDate } from '../../../helpers/js/FormatDate';
/*--------------*/

export default function InputDate(props) {

    //# Props //

    const {
        id,
        inputsController,
    } = props

    //# Variáveis //
    //.. Input, Config //
    const input = {
        config: inputsController.config[id] || undefined,
        onChange: inputsController.onChange || undefined,
        data: inputsController.data || undefined
    }
    const config = {
        name: id,
        id: id,
        maxLength: 10,
        required: input.config.required,
        initial: input.config.initial,
        className: input.config.className,
        placeholder: input.config.placeholder || '2021/05/03',
        labelText: input.config.labelText
    }

    //.. Styles //
    const style = {
        width: `${input.config.width || ''}%`,
        height: `${input.config.height || ''}%`,
        display: `${input.config.display || undefined}`
    }

    //.. States //
    const [input_value, setInputValue] = useState(config.initial)

    /*--------------*/

    //# Verificações //

    const vitalError =
        !id
            ? `;------- Error InputDate -------; ID É Obrigatório Em Todos Os Input Date.`
            : null

    if (vitalError) {
        console.error(vitalError)
        return
    }
    if (!inputsController) {
        console.error(`;------- Error InputDate ${id} -------; Aviso, Nenhum InputController Foi Recebido Como Parametro. A Renderização Continuará`)
    }

    //# Funções //


    function handleChange(event) {
        const target = event.target
        const { value } = target
        if (/[^0-9/]/.test(value)) return
        if (input.onChange) {
            const date_numbers = value.replace(/\D/g, '');

            const obj_date = {
                year: date_numbers.slice(0, 4) || '',
                month: date_numbers.slice(4, 6) || '',
                day: date_numbers.slice(6, 8) || ''
            }
            const formattedDate = [obj_date.year, obj_date.month, obj_date.day].filter(Boolean).join('/');
            setInputValue(formattedDate)

            target.value = FormatDate(formattedDate)
            input.onChange(event, 'date')
        }
    }

    /*--------------*/
    return (
        <>
            {
                config.labelText ?
                    <label className='label-input' htmlFor={config.id}>
                        <TxtPadrão texto={config.labelText} default_color={true} type={'span'} />
                    </label>
                    : null
            }
            <input
                type={'text'}
                value={input_value}
                id={config.id}
                maxLength={config.maxLength}
                placeholder={config.placeholder}
                name={config.name}
                required={config.required}
                autoComplete="off"
                className={frmt(`input-date ${config.className}`)}
                onChange={handleChange}
                style={style}
            />
        </>
    )
}
