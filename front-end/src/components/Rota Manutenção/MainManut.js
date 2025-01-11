//# Componentes //
import TxtH1 from '../Componentes Globais/Miscellaneous/TxtPadrão'
import TxtSombra from '../Componentes Globais/Div/divSombra';
//# Libs //
import { Outlet } from "react-router-dom";
//# Classes //
import './MainManut.scss'
/*--------------*/

export default function MainManut() {
    return (
        <>
            <TxtH1 type='h1' texto='Manutenção' upper={true} title={true} />
            <TxtSombra />
            <div className="main-manut">
                <div className="main-manut__content">
                    <Outlet />
                </div>
            </div>
        </>
    )
}