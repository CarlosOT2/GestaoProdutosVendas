//# Libs // 
import { useContext } from 'react'
//# Icons //
import { FaSun, FaMoon } from 'react-icons/fa';
//# Context //
import cntxt_usr_cnfg from '../../../config/usr_cnfg/context/cntxt_usr_cnfg'
//# Classes //
import './ChangeTheme.scss'

export default function ConfigGerais() {
    //# Context //
    const { usr_cnfg, set_usr_cnfg } = useContext(cntxt_usr_cnfg)

    //# Funções //

    function ToggleTheme() {
        const theme = usr_cnfg.bg_theme === 'light_bg' ? 'dark_bg' : 'light_bg'
        set_usr_cnfg('bg_theme', theme)
    }

    return (
        <>
            <button onClick={ToggleTheme} className='button-theme'>
                {usr_cnfg.bg_theme === 'light_bg' ? <FaSun className='button-theme__icon-sun' /> : <FaMoon className='button-theme__icon-moon' />}
            </button>
        </>
    )
}