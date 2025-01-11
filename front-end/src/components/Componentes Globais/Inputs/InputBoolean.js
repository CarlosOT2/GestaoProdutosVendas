//# Componentes //
import InputRadio from "./InputRadio"
import TxtPadrão from "../Miscellaneous/TxtPadrão";
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';
//# Libs //
import { useEffect } from 'react'
//# Classes //
import './InputBoolean.scss'
/*--------------*/

export default function InputBoolean({
    inputsController,
    className,
    message,
    margin,
    center,
    id,
    JSX
}) {

    //# Variáveis //
    const condition = inputsController ? inputsController.data[`radio-${id}`] : undefined

    //# useEffect // 
    useEffect(() => {
        inputsController.onReset(id)
    }, [condition])

    //# Verificações //
    const vitalError =
        !id ? `;------- Error InputBoolean -------; Id É Obrigatório Em Todos Os Input Boolean.`
            : !inputsController.config[id] ? `;------- Error InputBoolean -------; Não Foi Encontrado Nenhum Input Com ID; '${id}' Registrado`
                : null

    if (vitalError) {
        console.error(vitalError)
        return
    }
    if (!inputsController) {
        console.error(`;------- Error InputBoolean ${id} -------; Aviso, Nenhum InputController Foi Recebido Como Parametro. A Renderização Continuará`)
    }

    return (
        <>
            <div className={frmt(`
            div-input-boolean
            ${className || ''}
            ${margin ? 'div-input-boolean--margin' : ''}
            `)}>
                <TxtPadrão type='span' texto={message} className='div-input-boolean__txt' />
                <br />
                <InputRadio
                    id={`true-${id}`}
                    value={'true'}
                    labelText={'Sim'}
                    name={`radio-${id}`}
                    inputsController={inputsController}
                />
                <InputRadio
                    id={`false-${id}`}
                    value={'false'}
                    labelText={'Não'}
                    name={`radio-${id}`}
                    inputsController={inputsController}
                />
            </div>
            <div className={frmt(`
            div-input-jsx
            ${center ? 'div-input-jsx--center' : ''}
            `)}>
                {
                    condition === `true` ?
                        <>
                            {JSX}
                        </>
                        :
                        <></>
                }
            </div>
        </>)
}