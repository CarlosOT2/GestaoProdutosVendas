//# Componentes //
import Txt from "../Miscellaneous/TxtPadrão"
import IconComponent from '../Miscellaneous/IconComponent'
//# Libs //
import { useState } from 'react'
//# Icons //
import { MdOutlineFileUpload } from "react-icons/md";
//# Classes //
import './InputFile.scss'
//# Helpers //
import { frmt } from "../../../helpers/js/FormatClasses";
/*--------------*/

export default function InputFile(
    {
        labelClassName,
        txtFileClassName,
        inputsController, /*[inputData, onChange, inputConfig]*/
        center,
        id
    }
) {

    //# Variáveis //

    const [file, setFile] = useState(undefined)
    const input = {
        config: inputsController ? inputsController.config[id] : undefined,
        onChange: inputsController ? inputsController.onChange : undefined
    }
    const style = {
        width: `${input.config.width || ''}%`,
        height: `${input.config.height || ''}%`,
    }

    /*--------------*/

    //# Verificações //

    const vitalError =
        !id
            ? `;------- Error InputFile -------; ID É Obrigatório Em Todos Os Input File.`
            : null

    if (vitalError) {
        console.error(vitalError)
        return
    }
    if (!inputsController) {
        console.error(`;------- Error InputFile ${id} -------; Aviso, Nenhum InputController Foi Recebido Como Parametro. A Renderização Continuará`)
    }

    /*--------------*/
    return (
        //# InputFile //
        <>


            <div className={frmt(`
                div-file
                ${center ? 'div-file--center' : ''}
                `)}
                style={style}
            >
                <div className={`div-file__div`}>
                    {// .. Label //
                    }
                    <label className={`div-file__label ${labelClassName || ''}`} htmlFor={id}>
                        {// .. IconComponent //
                        }
                        <IconComponent
                            Icon={<MdOutlineFileUpload className='div-file__icon' />}
                        />
                        {// .. Input //
                        }
                        <Txt type='span' texto={`Upload your File`} className='div-file__txt-upload' />
                        <input
                            type='file'
                            id={id}
                            name={id}
                            className={`div-file__input`}
                            onChange={inputsController !== undefined ? (event) => {
                                setFile(event.target.files[0])
                                if (input.onChange) {
                                    input.onChange(event, 'file')
                                }
                            } : () => { }}
                        />
                    </label>
                    {// .. txtFileName //
                    }
                    <div className='div-file__file-name'>
                        <Txt
                            type='span'
                            className={`div-file__txt-file-name ${txtFileClassName || ''}`}
                            texto={`${file !== undefined ? file.name : 'No file chosen'}`}
                        />
                    </div>
                    {/*--------------*/}

                </div>
            </div>
        </>
        /*--------------*/
    )
}