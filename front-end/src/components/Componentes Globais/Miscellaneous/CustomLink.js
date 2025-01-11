//# Componentes //
import IconComponent from './IconComponent'
//# Libs //
import { Link } from 'react-router-dom'
//# Classes //
import './CustomLink.scss'
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';
/*--------------*/

export default function CustomLink(
    {
        texto,
        Rota,
        hover,
        focus,
        Icon,
        className
    }
) {

    /*--------------*/
    return (
        //.. Link //
        <Link
            to={Rota}
            className={frmt(
                `custom-link 
                ${hover ? 'custom-link--hover' : ''} 
                ${focus ? 'custom-link--focus' : ''} 
                ${className}`
            )}
        >
            {//.. Icon //
            }
            {Icon ? <IconComponent Icon={Icon} /> : <></>}
            {//.. Texto //
            }
            {texto}
        </Link>
    )
}