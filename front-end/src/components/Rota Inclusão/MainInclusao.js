//# Componentes //
import Txt from '../Componentes Globais/Miscellaneous/TxtPadrão'
import TxtSombra from '../Componentes Globais/Div/divSombra';
//# Libs //
import { Outlet } from "react-router-dom";
//# Classes //
import './MainInclusao.scss'
/*--------------*/


export default function MainInclusao() {
    return (
        <>
            <Txt type='h1' texto='Inclusão' upper={true} title={true} />
            <TxtSombra />
            <div className="main-inclusao">
                <div className="main-inclusao__content">
                    <Outlet />
                </div>
            </div>
        </>
    )
}