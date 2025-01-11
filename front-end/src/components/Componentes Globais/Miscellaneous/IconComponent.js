//# Libs //
import { cloneElement } from 'react';
//# Classes //
import './IconComponent.scss'
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';

export default function IconComponent(
    {
        Icon,
        div_classes,
        div = false,

        classes,
        title,
        Click
    }
) {
    const formatted_icon =
        Icon ?
            cloneElement(Icon, { className: frmt(`icon ${Icon.props.className || ''} ${classes}`) })
            :
            'IconComponent; Sem Nenhum Icone Passado Como Parametro.'
    return (
        div ?
            (
                <div
                    className={frmt(`div-icon ${div_classes || ''}`)}
                    onClick={(event) => { if (Click) Click(event) }}
                    title={title}
                >
                    {
                        formatted_icon
                    }
                </div>
            )
            :

            <>
                {
                    formatted_icon
                }
            </>
    )
}