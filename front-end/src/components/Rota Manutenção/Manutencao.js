//# Componentes //
import ListaProdutos, { structure_ListaProdutos } from './ListaProdutos'
import ListaVendas, { structure_ListaVendas } from './ListaVendas'
import PaginationComponent from '../Componentes Globais/Lista/PaginationComponent'
import ManutForm from './ManutForm'
import DivAlert from '../Componentes Globais/Div/divAlert'
//# Libs //
import { useState, useEffect } from 'react'
//# Helpers //
import PaginationControl from '../../helpers/js/PaginationControl.js'

//# Exportações //

export default function Manutencao({ Lista }) {
    //# States //
    const [alert_status, setAlertValue] = useState({
        text: '',
        status: ''
    })
    const [Dados, setDados] = useState([])
    const [url, setUrl] = useState({
        end_point: {
            path: `${Lista}`,
            query: undefined,
            id_column: Lista
        }
    })

    //# Variáveis //
    const Listas = {
        produtos: structure_ListaProdutos().tBodyTr_Produtos.key,
        vendas: structure_ListaVendas().tBodyTr_Vendas.key
    }
    const { req_pagination, visible } = PaginationControl({
        id_column: url.end_point.id_column,
        obj_data: { data: Dados, setData: setDados },
        req_function: {
            success: () => {
                setAlertValue({ text: ``, status: 'success' })
            },
            error: (error) => {
                setAlertValue({ text: `${error.message}`, status: 'fail' })
            }
        }
    })

    //# Verificações //

    const vitalError =
        !Listas[Lista]
            ? `;------- Error Manutencao -------; Lista '${Lista}' Não Encontrada.`
            : null

    if (vitalError) {
        console.error(vitalError)
        return
    }

    //# useEffects //

    useEffect(() => {
        setAlertValue({
            text: 'Enviado...',
            status: 'pending'
        });
        setUrl(prevState => ({
            ...prevState,
            end_point: {
                ...prevState.end_point,
                path: `${Lista}`,
                id_column: Listas[Lista]
            }
        }))
    }, [Lista])
    useEffect(() => {
        req_pagination(`${url.end_point.path}${url.end_point.query ? `/filtrar?${url.end_point.query}` : ''}`)
    }, [url])

    /*--------------*/
    return (
        <>
            {//.. Barra De Pesquisa (Form) //
            }
            <ManutForm
                Lista={Lista}
                setUrl={setUrl}
            />
            {/*--------------*/}
            {//.. divAlert //
            }
            <DivAlert
                text={alert_status.text}
                status={alert_status.status}
            />
            {/*--------------*/}
            {//.. Lista //
            }
            {alert_status.status !== 'fail' && alert_status.status !== 'pending' && (
                <>
                    {Lista === 'produtos' ? (
                        //.. PRODUTOS //
                        <ListaProdutos config_dados={{ Dados, setDados }} />
                    ) : Lista === 'vendas' ? (
                        //.. VENDAS //
                        <ListaVendas config_dados={{ Dados, setDados }} />
                    ) : (
                        <></>
                    )}
                    <PaginationComponent
                        config_pagination={{
                            req_pagination,
                            visible,
                            url: `${url.end_point.path}${url.end_point.query ? `/filtrar?${url.end_point.query}` : ''}`
                        }}
                    />
                </>
            )}
            {/*--------------*/}
        </>
    )
}


