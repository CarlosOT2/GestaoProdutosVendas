
//# Componentes //
import Txt from '../Miscellaneous/TxtPadrão'
//# Classes //
import './ListaTHEAD.scss'
/*--------------*/

export default function ListaTHEAD(
    {
        tHeadTh
    }
) {
    //# Verificações //
    if (!Array.isArray(tHeadTh)) {
        console.error('Error; THEAD Componente, Argumento Passado Não É Um Array')
        return
    }

    //# Funções //
    function create_th(config_td) {
        const { thElemento } = config_td
        return (
            <th
                key={thElemento.innerText}
                id={thElemento.id || ''}
                className={
                    `
                    t-head__th 
                    ${thElemento.className || ''}
                    `
                }
            >
                <Txt
                    texto={thElemento.innerText}
                    className='t-head__txt'
                    type={'span'}
                />
            </th>
        )
    }

    return (
        <>
            <thead className='t-head'>
                {// .. Tr //
                }
                <tr className='t-head__tr'>
                    {// .. Th //
                    }
                    {tHeadTh.map(thElemento => create_th({ thElemento }))}
                </tr>
            </thead>
        </>
    )
}


