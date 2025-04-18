//# Variáveis Import //
import WebService from '../../../config/config_websv'
//# Componentes //
import Txt from '../Miscellaneous/TxtPadrão'
//# Classes //
import './ListaTBODY.scss'
//# Helpers //
import { frmt } from '../../../helpers/js/FormatClasses';
import { PerformRequest } from '../../../helpers/js/PerformRequest'

export default function ListaTBODY(
    {
        tHeadTh,
        tBodyTd,
        tBodyTr,
        actions,
        config_dados
    }
) {
    //# Variáveis //
    //.. States //
    const { Dados, setDados } = config_dados
    //.. Tr //
    const keyTr = tBodyTr.key
    const classNameTr = tBodyTr.className
    //.. Actions //
    const actionDel = actions.actionDel
    const actionAlt = actions.actionAlt
    const actionAdd = actions.actionAdd

    //# Condições //

    if (actionAlt) {
        const actionAltProps = actionAlt.props
        for (let i = 0; i < tBodyTd.length; i++) {
            const AltProps = procuraColumn(tBodyTd[i].column, actionAltProps)
            if (AltProps) {
                tBodyTd[i]['actionAlt'] = AltProps
            }
        }
    }

    //# REQS //

    //.. Put //
    async function reqPut(cod, data) {
        return await PerformRequest(
            {
                fetch: {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    url: `${WebService}/${actionAlt.rota}/${cod}`,
                },
                message: {
                    success: `status.{'status'} - {'res.info'}`,
                    error: `status.{'status'} - {'res.info'}`,
                    alert_error: true
                },
                return: 'res.ok'
            }

        )
    }
    //.. Delete //
    async function reqDelete(cod) {
        return await PerformRequest({
            fetch: {
                method: 'DELETE',
                url: `${WebService}/${actionDel.rota}/${cod}`
            },
            message: {
                success: `Cód.${cod} - {'res.info'}`,
                error: `status.{'status'} - {'res.info'}`,
                alert_error: true
            },
            return: 'res.ok'
        })

    }
    //.. Post //
    async function reqPost(data) {
        return await PerformRequest({
            fetch: {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                url: `${WebService}/${actionAdd.rota}`
            },
            message: {
                success: `status.{'status'} - {'res.info'}`,
                error: `status.{'status'} - {'res.info'}`,
                alert_error: true
            },
            return: 'res.ok'
        })
    }

    //# Funções //

    //.. procuraColumn //
    function procuraColumn(column, vetorObjetos) {
        for (let i = 0; i < vetorObjetos.length; i++) {
            if (column === vetorObjetos[i].column) {
                return vetorObjetos[i]
            }
        }
        return null
    }

    //.. findDadoIndex //
    function findDadoIndex(cod) {
        return Dados.findIndex((Dado) => Dado[keyTr] === Number(cod))
    }

    //.. ACTION //
    async function action(Event) {
        //.. VARIÁVEIS //
        //, Gerais //
        const td = Event.target
        const tdID = td.id
        const DadosCopia = [...Dados]

        //, Para 'Delete' e 'Add' //
        const cod = td.parentNode.parentNode.querySelector('td').innerText

        //.. ACTION CONDIÇÕES //
        //, DELETE // 
        if (td.title.includes('Excluir')) {
            if (window.confirm(actionDel.props.message)) {
                const dado_indice = findDadoIndex(cod)
                if (dado_indice !== -1) {
                    await actDelete(dado_indice)
                    return
                }
                console.error(`;------- Error Action Delete -------; dado_indice Retornou -1`)
            }
        }
        //, ADD //
        if (td.title.includes('Adicionar')) {
            if (window.confirm('Confirma?')) {
                const dado_indice = findDadoIndex(cod)
                if (dado_indice !== -1) {
                    await actAdd(dado_indice)
                    return
                }
                console.error(`;------- Error Action Add -------; dado_indice Retornou -1`)
            }
        }
        //, ALTERAR //
        const props = await procuraColumn(tdID, actionAlt.props)
        if (props) {
            const codAlt = td.parentNode.querySelector('td').innerText
            const dado_indice = findDadoIndex(codAlt)
            if (dado_indice !== -1) {
                await actAlt(dado_indice, codAlt)
                return
            }
            console.error(`;------- Error Action Alterar -------; dado_indice Retornou -1`)
        }

        //.. ACTION FUNÇÕES //
        //, DELETE // 
        async function actDelete(dado_indice) {
            if (await reqDelete(cod)) {
                DadosCopia.splice(dado_indice, 1)
                setDados(DadosCopia)
            }
        }
        //, ADD //
        async function actAdd(dado_indice) {
            //, Variáveis Gerais 'ActAdd //
            const actData = actionAdd.props.data
            const actType = actionAdd.props.type
            const actKeys = Object.keys(actData)
            console.log(actionAdd)

            //- Laço Repetição; Criar O Body(Data) Da Request //
            let reqData = {}
            for (let i = 0; i < actKeys.length; i++) {
                const keyName = actKeys[i]
                const objData = actData[keyName]
                let value;

                //, PROMPT //
                const prompt_obj = objData.prompt
                if (prompt_obj) {
                    //, Type //
                    const type = prompt_obj.type
                    let prompt_value;
                    //- Undefined/Null (Tipo Não Informado) //
                    if (type === null || type === undefined) {
                        prompt_value = prompt(prompt_obj.message)
                    }

                    //, Cancel //
                    if (prompt_value === prompt_obj.cancel) {
                        return
                    }

                    value = prompt_value
                }

                //, COLUMN //
                if (objData.column) {
                    const column = objData.column
                    value = Dados[dado_indice][column]
                }

                //, VALUE //
                if (objData.value) {
                    value = objData.value
                }

                //, CONFIG_VALUE //
                const config_value = objData.config_value
                if (config_value) {

                    //, DEFAULT //
                    if (!value) {
                        const config_default = config_value.default
                        if (config_default === 0 || config_default) {
                            //- Sem Objeto
                            if (typeof config_default !== 'object') {
                                value = config_default
                            }
                            //- Column
                            if (config_default.column) {
                                const column = config_default.column
                                value = Dados[dado_indice][column]
                            }
                        }

                    }
                    //, DESCONTO //
                    const desconto_column = config_value.desconto
                    if (desconto_column) {
                        const valor_descontado = reqData[desconto_column]
                        if (!isNaN(valor_descontado)) {
                            reqData[desconto_column] = (valor_descontado - valor_descontado * (value / 100)).toFixed(2)
                        } else {
                            console.error(`O 'valor_descontado'; ${valor_descontado}, Não É Númerico.`)
                        }
                    }
                    //, VERIFY //
                    const verify_value = config_value.verify
                    if (verify_value) {
                        let invalid_value = false;

                        //- Int
                        if (verify_value.type === 'int') {
                            invalid_value = isNaN(value)
                            if (!invalid_value) {
                                invalid_value = Number(value) > verify_value.max || Number(value) < verify_value.min
                            }
                        }

                        if (invalid_value) {
                            alert(verify_value.error_message || 'Valor Inválido')
                            return
                        }
                    }

                }
                reqData[keyName] = value
            }

            //, REQ_POST //
            try {
                if (actType.name === 'sales') {
                    const column = {
                        storage: actType.column.storage_value,

                    }
                    const data = {
                        quantity_sales: actType.data.quantity_sales
                    }
                    const error_message = {
                        storage: actType.error_message.storage_value,
                        quantity: actType.error_message.quantity_sales
                    }

                    const value = Number(Dados[dado_indice][column.storage])
                    if (value <= 0) {
                        throw new Error(error_message.storage || `'${column.storage}' Igual Á 0 Ou Menor; Impossível Adicionar`)
                    }

                    const quantity_sales = reqData[data.quantity_sales]
                    const newValue = value - quantity_sales
                    if (newValue < 0) {
                        throw new Error(error_message.quantity || `Impossível Adicionar '${quantity_sales}'; '${column.storage}' Abaixo De 0`)
                    }

                    if (await reqPut(cod, { [column.storage]: newValue })) {
                        DadosCopia[dado_indice][column.storage] = newValue
                    }
                }
                if (await reqPost(reqData)) {
                    setDados(DadosCopia)
                }
            } catch (error) {
                console.error(error)
                alert(error.message)
            }
        }
        //, ALTERAR //
        async function actAlt(dado_indice, codAlt) {
            //, TYPE //
            let Alteracoes = prompt(props.prompt)
            if (Alteracoes === null) {
                return
            }
            let Validacao;
            let msg;
            if (props.type === 'string') {
                Validacao = isNaN(Alteracoes) && Alteracoes.length <= 255
                msg = 'Digite Um Nome. (Maximo de 255 Caracteres)'
            }
            if (props.type === 'int') {
                Validacao = !isNaN(Alteracoes) && Alteracoes % 1 === 0 && Alteracoes >= 0
                Alteracoes = Number(Alteracoes).toFixed(0)
                msg = 'Digite Uma Quantidade Válida. (Apenas Números Inteiros, Divisivel Por 1)'
            }
            if (props.type === 'cash') {
                Validacao = !isNaN(Alteracoes) && Alteracoes >= 0.01 && Alteracoes <= 999999.99
                Alteracoes = Number(Alteracoes).toFixed(2)
                msg = 'Digite Um Valor Válido. (Apenas Números Divisivel Maior que 0.01, E Menor Que 999999.99)'
            }
            if (props.type === 'perc') {
                Validacao = !isNaN(Alteracoes) && Alteracoes >= 0 && Alteracoes <= 100 && Alteracoes % 1 === 0
                msg = 'Digite Um Desconto Válido. (Números Inteiros, De 0 á 100)'
            }
            //, REQ_PUT //
            try {
                if (!Validacao) {
                    throw new Error(msg)
                }
                await reqPut(codAlt, { [tdID]: Alteracoes })
                DadosCopia[dado_indice][tdID] = Alteracoes
                setDados(DadosCopia)
            } catch (error) {
                console.error(error)
                alert(error.message)
            }
        }
    }
    //# Funções TD //

    //.. CREATE_TD //
    function create_td(config_td) {
        //.. Variáveis Globais //
        const { indice_dado, indice_td, td, dado } = config_td
        const td_style = { cursor: td.actionAlt ? 'pointer' : 'default' }

        //.. Verificações //
        const vitalError =
            !dado
                ? `dado '${dado}' inválido na função 'create_td'.` :
                !td
                    ? `td '${td}' inválido na função 'create_td'.` :
                    !indice_dado && indice_dado !== 0
                        ? `indice dado  inválido na função 'create_td'.` :
                        null

        if (vitalError) {
            console.error(`;------- Error ListaTBODY -------; ${vitalError}`)
            return
        }

        //.. Td Funções //
        function create_td_value() {
            const dado_value = Dados[indice_dado][td.column]
            //, Img //
            if (td.img) {
                return <img
                    className='t-body__td-img-tam'
                    title={`Imagem Cód.${dado[keyTr]}`}
                    alt={`Imagem Cód.${dado[keyTr]}`}
                    src={dado_value}
                />
            }
            //, Txt //
            const th_text = tHeadTh[indice_td].innerText
            let txt = dado_value
            if (td.desconto) {
                const perc_desconto = parseFloat(dado[td.desconto])
                const valor_atual = parseFloat(txt)
                if (!isNaN(perc_desconto) && !isNaN(valor_atual)) {
                    const novo_valor = valor_atual - valor_atual * (perc_desconto / 100)
                    txt = novo_valor.toFixed(2)
                }
            }
            txt = td.cash ? Number(txt).toFixed(2) : txt
            txt = td.percentage ? `${txt}%` : txt

            return (
                <>
                    <Txt
                        type={'span'}
                        className={'t-body__td-txt'}
                        style={td_style}
                        onClick={(event) => event.target.parentElement.click()}
                        texto={txt}
                    />
                </>
            )
        }

        //.. Variáveis //
        const td_classes = frmt(`
            t-body__td 
            ${td.className || ''} 
            ${td.img ? 't-body__td-img' : ''} 
            ${td.number ? 't-body__td-number' : ''}
            ${(td.cash || td.desconto) ? 't-body__td-cash' : ''} 
            ${td.percentage ? 't-body__td-percentage' : ''}
            ${td.date ? 't-body__td-date' : ''}
            ${td.id ? 't-body__td-id' : ''}
            `)
        const th_classes = frmt(`
                t-body__th 
                ${td.img ? 't-body__th-img' : ''}
                `)

        return (
            <>
                <th className={th_classes}>
                    <Txt
                        type={'span'}
                        className={'t-body__th-txt'}
                        texto={tHeadTh[indice_td].innerText}
                    />
                </th>
                <td
                    className={td_classes}
                    onClick={(td.actionAlt) ? action : () => { }}
                    title={`${td.title || ''}`}
                    style={td_style}
                    key={td.column}
                    id={td.column}
                >
                    {create_td_value()}
                </td>
            </>
        )
    }
    return (
        //# TBODY //
        <>
            <tbody className='t-body'>
                {
                    Dados.map((dado, indice_dado) => (
                        <>
                            <tr className={`t-body__tr ${classNameTr || ''}`} id={`${keyTr}`} key={dado[keyTr]}>
                                {//.. Td //
                                }
                                {
                                    tBodyTd.map((td, indice_td) => {
                                        return create_td({
                                            dado: dado,
                                            td: td,
                                            indice_dado,
                                            indice_td
                                        })
                                    })
                                }
                                { //.. Td Actions //
                                }
                                {(actionDel || actionAdd) && (
                                    <td className='t-body__td-acao'>
                                        {actionDel && (
                                            <div className='t-body__td-acao--excluir' title={actionDel.props.title} onClick={action}>
                                                &#10006;
                                            </div>
                                        )}
                                        {actionAdd && (
                                            <div className='t-body__td-acao--add' title={actionAdd.props.title} onClick={action}>
                                                $
                                            </div>
                                        )}
                                    </td>
                                )}
                            </tr>
                            <br className='t-body__br' />
                        </>
                    ))
                }
            </tbody >
        </>
    )
}