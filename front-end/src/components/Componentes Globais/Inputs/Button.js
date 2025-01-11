//# Classes //
import './Button.scss'
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';
/*--------------*/

export default function Button(
  {
    type,
    value,
    className,
    onClick,
  }
) {

  return (
    <>
      <input
        type={type}
        value={value}
        className={frmt(`button ${className || ''}`)}
        onClick={() => { if (onClick) onClick() }}
      />
    </>
  )
}