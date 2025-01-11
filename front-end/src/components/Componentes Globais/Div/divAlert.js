//# Classes //
import "./divAlert.scss"
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';
/*--------------*/

export default function divAlert({
    status,
    text,
    className,
}) {
    return (
        //.. divAlert //
        <div
            className={frmt(`
            div-alert
            ${(status === 'success' & text !== '') ? 'div-alert--sucess' : ''} 
            ${(status === 'fail' & text !== '') ? 'div-alert--fail' : ''}
            ${className}
            `)}>
            {//.. Text //
            }
            {text}
        </div>
    )
}