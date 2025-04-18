//# Componentes //
import THead from './ListaTHEAD'
import TBody from './ListaTBODY'
//# Classes //
import './Lista.scss'

/*--------------*/
//# Exportações //

//.. Lista //
export default function Lista(
    {
        tHeadTh,
        tBodyTr,
        tBodyTd,
        actionDel,
        actionAlt,
        actionAdd,
        config_dados,
        Rota = ''
    }
) {

    //# Verificações //

    if (!Array.isArray(tBodyTd)) {
        console.error('Error Lista; TBODY Componente, tBodyTd Passado Não É Um Array')
        return
    }
    if (!Rota) {
        console.error('Error Lista; Rota Não Definida')
    }

    /*--------------*/
    return (
        <>
            <table className='table-lista'>
                <THead
                    tHeadTh={tHeadTh}
                />
                <TBody
                    tHeadTh={tHeadTh}
                    tBodyTr={tBodyTr}
                    tBodyTd={tBodyTd}
                    config_dados={config_dados}
                    actions={
                        {
                            actionDel:
                                actionDel ? {
                                    props: actionDel,
                                    rota: actionDel.Rota || Rota
                                } : undefined,
                            actionAlt:
                                actionAlt ? {
                                    props: actionAlt.props,
                                    rota: actionAlt.Rota || Rota
                                } : undefined,
                            actionAdd:
                                actionAdd ? {
                                    props: actionAdd,
                                    rota: actionAdd.Rota || Rota
                                } : undefined
                        }
                    }
                />
            </table>
        </>
    )
}

