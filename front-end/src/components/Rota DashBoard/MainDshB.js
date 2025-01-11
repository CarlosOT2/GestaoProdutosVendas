//# Componentes //
import Txt from '../Componentes Globais/Miscellaneous/TxtPadrão'
import TxtSombra from '../Componentes Globais/Div/divSombra';
//# Libs //
import { Outlet } from "react-router-dom";
//# Classes //
import './MainDshB.scss'
/*--------------*/

export default function MainDashBoard() {
    return (
        <>
            <Txt type='h1' texto='DashBoard' upper={true} title={true} />
            <TxtSombra />
            <div className="main-dashboard">
                <div className="main-dashboard__content">
                    <Outlet />
                </div>
            </div>
        </>
    )
}