//# Libs //
import { Children } from 'react';
//# Componentes //
import Txt from './TxtPadrão'
//# Classes //
import './FieldSet.scss'
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';
/*--------------*/

export default function FieldSet({
    legendTxt,
    legendClassName,
    className,
    divClassName,
    center,
    JSX = <></>
}) {
    //.. Variables //
    const components_jsx = Children.toArray(JSX.props.children)
    
    return (
        <>
            {// .. FieldSet //
            }
            <fieldset
                className={frmt(`field-set ${className || ''}`)}
            >
                {// .. Legend //
                }
                {legendTxt ?
                    <legend>
                        <Txt
                            type='span'
                            texto={legendTxt}
                            className={`field-set__legend ${legendClassName ? legendClassName : ''}`}
                        />
                    </legend>
                    : <></>
                }
                {// .. divFieldSet //
                }
                <div
                    className={frmt(
                        `field-set__div 
                        ${components_jsx.length > 1 && center ? 'field-set__div--center-column' : ''}
                        ${center ? 'field-set__div--center' : ''}  
                        ${divClassName || ''}
                        `
                    )}
                >
                    {//.. JSX //
                        JSX
                    }
                </div>
            </fieldset>
        </>
    )
}