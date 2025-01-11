//# Libs //
import { useState } from "react";
//# Componentes //
import InputField from "./InputField"
//# Classes //
import './MergedInputsField.scss'
/*--------------*/

export default function MergedInputsField(props) {

    //# Props //
    
    const {
        type,
        id,
        inputsController
    } = props;
    
    /*--------------*/
    return (
        <>
            {//.. Input 1 [0] //
            }
            <InputField
                type={type[0]}
                id={id[0]}
                className={`
                merged-input--1
                 `}
                inputsController={inputsController}
            />
            {//.. Input 2 [1] //
            }
            <InputField
                type={type[1]}
                id={id[1]}
                className={`
                merged-input--2
             `}
                inputsController={inputsController}
            />
        </>
    )
}