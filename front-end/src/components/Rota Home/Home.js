//# Componentes //
import Txt from '../Componentes Globais/Miscellaneous/TxtPadrão'
//# Libs //
import { useState, useEffect } from 'react'
import { PerformRequest } from 'performrequest'
//# Classes //
import './Home.scss'
//# Helpers //
import Numeral from '../../helpers/js/Numeral';
//# Config //
import WebService from '../../config/config_websv'
/*--------------*/

export default function Home() {
    //# States //
    const [info, setInfo] = useState({})
    //# FUNÇÕES //
    //, REQ, RES //
    function format_res(res, config = {}) {
        const { current_txt, add_text, numeral } = config
        //.. Verify //
        if (!current_txt) {
            console.error(`;------- Error 'format_res' -------; 'current_txt' É Obrigatório`)
            return
        }
        const formatted_res = {}
        Object.keys(res).forEach(current_key => {
            //.. Format Data //
            
            const formatted_data = { ...res[current_key] }

            //, Numeral //
            if (numeral) {
                Object.keys(numeral).forEach(numeral_key => {
                    if (numeral_key in formatted_data) {
                        formatted_data[numeral_key] = Numeral(formatted_data[numeral_key]).format(numeral[numeral_key])
                    }
                })
            }
            //, Add Text //
            if (add_text) {
                Object.keys(add_text).forEach(addText_key => {
                    if (addText_key in formatted_data) {
                        formatted_data[addText_key] = add_text[addText_key] + formatted_data[addText_key]
                    }
                })
            }
            //.. Formatted Object //
            formatted_res[current_key] = {
                current_txt: formatted_data[current_txt[current_key]],
                info: formatted_data
            }
        })
        return formatted_res
    }
    async function req() {
        await PerformRequest({
            fetch: {
                url: `${WebService}/dashboard/overview`,
                method: 'GET',
            },
            message: {
                success: `status.{'status'} - Sucesso`,
                error: `status.{'status'} - {'res.info'}`
            },
            function: {
                success: (req_json) => {
                    const res_info = req_json.info
                    const obj_produtos = format_res(
                        res_info.produtos,
                        {
                            current_txt: {
                                mais_lucro: 'nome',
                                mais_vendido: 'nome',
                                menos_lucro: 'nome',
                            },
                            add_text: {
                                quantidade_vendas: `Vendas; `
                            },
                            numeral: {
                                lucro: '$0,0',
                                quantidade_vendas: '0,0'
                            }
                        }
                    )
                    const obj_vendas = format_res(
                        res_info.vendas,
                        {
                            current_txt: {
                                lucro_diario: 'lucro',
                                lucro_semanal: 'lucro',
                                lucro_mensal: 'lucro',
                            },
                            add_text: {
                                quantidade_vendas: `Vendas; `
                            },
                            numeral: {
                                lucro: '$0,0',
                                quantidade_vendas: '0,0'
                            }
                        }
                    )
                    setInfo({
                        produtos: { ...obj_produtos },
                        vendas: { ...obj_vendas }
                    })
                }
            }
        })
    }
    //, change_TXT
    async function change_TXT(Event) {
        const splitted_id = Event.target.id.split('__')

        const copy_info = { ...info }
        const obj_info = copy_info[splitted_id[0]][splitted_id[1]]

        const keys_name = Object.keys(obj_info.info)

        for (let i = 0; i < keys_name.length; i++) {
            const key_name = keys_name[i]
            if (obj_info.info[key_name] !== obj_info.current_txt) {
                obj_info.current_txt = obj_info.info[key_name]
                break
            }
        }

        copy_info[splitted_id[0]][splitted_id[1]] = obj_info
        setInfo(copy_info)
    }
    //# useEffects //
    useEffect(() => {
        req()
    }, [])

    /*--------------*/

    return (
        <>
            {//# DASHBOARD //
            }
            <div className='dash-board'>
                <Txt type='span' texto='Resumo' user_select={true} className='dash-board__txt-resumo' />
                {//# PRODUTOS //
                }
                <section className='dash-board__section'>
                    <Txt type='span' texto='Produtos' title_2={true} className='dash-board__section-title' />
                    <div className='dash-board__div-info'>
                        { // .. MENOS_LUCRO //
                        }
                        <article className={`dash-board__article`}>
                            <Txt
                                onClick={change_TXT}
                                type='span'
                                texto={info.produtos?.menos_lucro.current_txt}
                                className='dash-board__article-info'
                                id={'produtos__menos_lucro'}
                            />
                            <Txt type='span' texto={'MENOS LUCRO'} className={`dash-board__article-label`} />
                        </article>
                        { // .. MAIS_LUCRO //
                        }
                        <article className={`dash-board__article`}>
                            <Txt
                                onClick={change_TXT}
                                type='span'
                                texto={info.produtos?.mais_lucro.current_txt}
                                className='dash-board__article-info'
                                id={'produtos__mais_lucro'}
                            />
                            <Txt type='span' texto={'MAIS LUCRO'} className={`dash-board__article-label`} />
                        </article>
                        { // .. MAIS_VENDIDO //
                        }
                        <article className={`dash-board__article`}>
                            <Txt
                                onClick={change_TXT}
                                type='span'
                                texto={info.produtos?.mais_vendido.current_txt} className='dash-board__article-info'
                                id={'produtos__mais_vendido'}
                            />
                            <Txt type='span' texto={'MAIS VENDIDO'} className={`dash-board__article-label`} />
                        </article>
                    </div>
                </section>
                {//# VENDAS //
                }
                <section className='dash-board__section'>
                    <Txt type='span' texto='Lucros' title_2={true} className='dash-board__section-title' />
                    <div className='dash-board__div-info'>
                        { // .. LUCRO_DIÁRIO //
                        }
                        <article className={`dash-board__article`}>
                            <Txt
                                onClick={change_TXT}
                                type='span'
                                texto={info.vendas?.lucro_diario.current_txt} className='dash-board__article-info'
                                id={'vendas__lucro_diario'}
                            />
                            <Txt type='span' texto={'LUCRO DIÁRIO'} className={`dash-board__article-label`} />
                        </article>
                        { // .. LUCRO_SEMANAL //
                        }
                        <article className={`dash-board__article`}>
                            <Txt
                                onClick={change_TXT}
                                type='span'
                                texto={info.vendas?.lucro_semanal.current_txt} className='dash-board__article-info'
                                id={'vendas__lucro_semanal'}
                            />
                            <Txt type='span' texto={'LUCRO SEMANAL'} className={`dash-board__article-label`}
                            />
                        </article>
                        { // .. LUCRO_MENSAL //
                        }
                        <article className={`dash-board__article`}>
                            <Txt
                                onClick={change_TXT}
                                type='span'
                                texto={info.vendas?.lucro_mensal.current_txt} className='dash-board__article-info'
                                id={'vendas__lucro_mensal'}
                            />
                            <Txt type='span' texto={'LUCRO MENSAL'} className={`dash-board__article-label`} />
                        </article>
                    </div>
                </section>
            </div>
        </>
    )
}