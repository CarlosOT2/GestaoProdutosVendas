//# Componentes //
import IconComponent from './IconComponent'
//# Classes //
import './TxtPadrão.scss'
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';
/*--------------*/

export default function TxtPadrão(

    {
        texto,
        type,
        upper = false,
        user_select = false,
        Txt_icon,
        id,
        pointer,
        bold,
        title = false,
        title_2 = false,
        default_color = false,
        centralizar = false,
        onClick,
        style,
        className = '',
    }
) {
    //# Verificações //

    const vitalError =
        !type
            ? `;------- Error TxtPadrão -------; Type É Obrigatório Em Todos Os TxtPadrão.`
            : verifyType(type)
                ? `;------- Error TxtPadrão -------; Type Inválido; ${type}.`
                : null
    if (vitalError) {
        console.log(vitalError)
        return
    }
    //# Funções //

    function verifyType(type) {
        const regular = /^(h[1-6]|pre|span)$/
        return !(regular.test(type))
    }

    /*--------------*/
    //# Funções Componentes //
    //.. Txt // 
    function Txt() {
        const Tag = type
        return (
            <Tag
                className={frmt(`
                    txt-padrao 
                    ${className || ''} 
                    ${type === 'h1' ? 'txt-padrao--h1' : ''} 
                    ${centralizar ? 'txt-padrao--centralizar' : ''}
                    ${bold ? 'txt-padrao--bold' : ''}
                    ${title ? 'txt-padrao--title' : ''}
                    ${title_2 ? 'txt-padrao--title_2' : ''}
                    ${default_color ? 'txt-padrao--default-color' : ''}
                    ${pointer ? 'txt-padrao--cursor-pointer' : ''}
                    ${user_select || title || title_2 ? 'txt-padrao--user-select' : ''}
                `)}
                onClick={onClick ? onClick : () => { }}
                style={style}
                id={id}
            >
                {upper ? texto.toUpperCase() : texto}
            </Tag>
        )
    }

    /*--------------*/

    return (
        <>
            {
                <>
                    {
                        Txt_icon ?
                            <IconComponent
                                Icon={Txt_icon}
                                classes={'txt-padrao-icon'}
                            />
                            :
                            null
                    }
                    <Txt />
                </>
            }
        </>
    )
}