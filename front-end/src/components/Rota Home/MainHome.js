//# Componentes //
import TxtH1 from '../Componentes Globais/Miscellaneous/TxtPadrão'
import TxtSombra from '../Componentes Globais/Div/divSombra';
//# Libs //
import { Outlet } from "react-router-dom";
//# Classes //
import './MainHome.scss'
/*--------------*/

export default function MainHome() {
    return (
        <>
            <TxtH1
                type='h1'
                texto='Home'
                upper={true}
                title={true}
            />
            <TxtSombra />
            <div className="main-home">
                <div className="main-home__content">
                    <Outlet />
                </div>
            </div>
        </>
    )
}