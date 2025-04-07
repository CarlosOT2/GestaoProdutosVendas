//# Import //

import express from 'express';
import cors from 'cors';
import HTTPError from '../helpers/Classes/HTTPError.js';

import { current_date, start } from '../helpers/Date/get_date.js';
import { format_StringDate } from '../helpers/Date/format_date.js';
import RequiredVariables from '../helpers/RequiredVariables.js'
import { db_gestaoprodutosvendas } from '../db/db_config.js';


//# Variáveis Globais //

const router = express.Router()

//# Middlewares Globais //

router.use(cors())

//# Funções //

async function info_dashboard(config_obj) {
    //.. Variáveis //
    const {
        type,
        limit,
        quantidade_vendas,
        order,
        previous_date,
        current_date
    } = config_obj

    if (await RequiredVariables({ type }, { return_boolean: true })) return

    //.. Query //
    let query;
    async function exec_query(default_value) {
        if (limit) query.limit(limit)

        const result = await query
        if (default_value) {
            if (Array.isArray(result) && result.length === 0) return default_value
            if (!result) return default_value
        }
        return result
    }
    async function build_query(config_obj) {
        const { lucro_query } = config_obj
        if (lucro_query) return { [lucro_query]: db_gestaoprodutosvendas.raw('cast(f_valor_vendas as signed) - cast(f_valorFornecedor_vendas as signed)') }
    }
    //.. Type //
    //, Lucros //
    //-- Lucro, Vendas Anual //
    if (type === 'lucro_anual') {
        query = db_gestaoprodutosvendas('vendas')
            .select(db_gestaoprodutosvendas.raw('MONTHNAME(d_data_vendas) AS mes'))
            .whereRaw('YEAR(d_data_vendas) = ?', [new Date().getFullYear()])
            .count('i_id_vendas as vendas')
            .sum(await build_query({ lucro_query: 'lucro' }))
            .groupBy(['mes'])
        //-- Ordernação E Formatação //
        const meses_ordem = [
            "janeiro", "fevereiro", "março", "abril", "maio",
            "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
        ];
        const data = await query
        const data_ordenada = meses_ordem.map(mes => {
            const mesEncontrado = data.find(d => d.mes === mes);
            return mesEncontrado || { mes: mes, vendas: 0, lucro: 0 };
        });
        return data_ordenada
    }
    //-- Lucro, Vendas Semanal //
    if (type === 'lucro_semanal') {
        query = db_gestaoprodutosvendas('vendas')
            .select(
                db_gestaoprodutosvendas.raw('DAYNAME(d_data_vendas) as dia')
            )
            .whereBetween('d_data_vendas', [
                db_gestaoprodutosvendas.raw('CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY'),
                db_gestaoprodutosvendas.raw('CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY + INTERVAL 6 DAY')
            ])
            .sum(await build_query({ lucro_query: 'lucro' }))
            .count('* as vendas')
            .groupBy('dia')
        //-- Ordernação E Formatação //
        const dias_ordem = [
            "segunda", "terça", "quarta",
            "quinta", "sexta", "sábado", "domingo"
        ];
        const data = await query
        const data_ordenada = dias_ordem.map(dia => {
            const diaEncontrado = data.find(d => d.dia === dia);
            return diaEncontrado || { dia: dia, vendas: 0, lucro: 0 };
        });
        return data_ordenada
    }
    //-- Lucro Total //
    if (type === 'lucro_total') {
        query = db_gestaoprodutosvendas('vendas')
            .sum(await build_query({ lucro_query: 'lucro' }))
        if (quantidade_vendas) query.count('* as quantidade_vendas')
        if (previous_date && current_date) query.whereBetween('d_data_vendas', [previous_date, current_date])
        const data = await exec_query()
        return data[0]
    }
    //-- Ranking Produtos Mais Vendidos //
    if (type === 'mais_vendidos') {
        query = db_gestaoprodutosvendas('vendas')
            .select('s_nome_vendas as nome')
            .count('* as quantidade_vendas')
            .groupBy('nome')
            .orderBy('quantidade_vendas', order || 'desc')
        return await exec_query([{ nome: 'Não Encontrado', quantidade_vendas: 0 }])
    }
    //-- Ranking Produtos Lucro //
    if (type === 'lucro_vendas') {
        query = db_gestaoprodutosvendas('vendas')
            .select('s_nome_vendas as nome')
            .sum(await build_query({ lucro_query: 'lucro' }))
            .groupBy('nome')
            .orderBy('lucro', order || 'desc')
        if (previous_date && current_date) query.whereBetween('d_data_vendas', [previous_date, current_date])
        if (quantidade_vendas) query.count('* as quantidade_vendas')
        return await exec_query([{ nome: 'Não Encontrado', lucro: 0 }])
    }
}

/*--------------*/
//# ROTAS //

const rotaGetPadrao = "/"
const rotaOverview = "/overview"

//.. Rota Get Padrão //
router.get(rotaGetPadrao, async (req, res) => {

    //.. Variables //
    let { limit, previous_date, current_date } = req.query
    const { lucro_maior, lucro_menor, lucro_total, lucro_anual, lucro_semanal } = req.query
    //.. Functions //
    async function format_dates() {
        return previous_date && current_date
            ?
            await format_StringDate({
                type: 'standard',
                verify: true,
                date: { previous_date, current_date }
            })
            :
            {}
    }

    try {
        const data = {}
        if (lucro_maior) {
            const { previous_date, current_date } = await format_dates()
            data.lucro_maior = await info_dashboard({
                type: 'lucro_vendas',
                previous_date,
                current_date,
                limit
            })
        }
        if (lucro_menor) {
            const { previous_date, current_date } = await format_dates()
            data.lucro_menor = await info_dashboard({
                type: 'lucro_vendas',
                previous_date,
                current_date,
                limit,
                order: 'asc'
            })
        }
        if (lucro_total) {
            const { previous_date, current_date } = await format_dates()
            data.lucro_total = await info_dashboard({
                type: 'lucro_total',
                previous_date,
                current_date
            })
        }
        if (lucro_anual) data.lucro_anual = await info_dashboard({ type: 'lucro_anual' })
        if (lucro_semanal) data.lucro_semanal = await info_dashboard({ type: 'lucro_semanal' })

        res.status(200).json({ info: data })
    } catch (error) {
        res.status(error.status || 400).json({ info: error.message })
    }
})
//.. Rota Overview //
router.get(rotaOverview, async (req, res) => {
    try {

        //.. Produtos //
        const lucro_maior = await info_dashboard({ type: 'lucro_vendas' })
        const mais_vendido = await info_dashboard({ type: 'mais_vendidos' })
        const produtos = {
            //, Menos Lucro //
            menos_lucro: lucro_maior[lucro_maior.length - 1],
            //, Mais Lucro //
            mais_lucro: lucro_maior[0],
            //, Mais Vendido //
            mais_vendido: mais_vendido[0]
        }
        //.. Vendas //
        const date_object = {
            month: start('startOfMonth'),
            week: start('startOfWeek'),
            day: start('startOfDay'),
            current_date: current_date()
        }
        const vendas = {
            //, Lucro Diário //
            lucro_diario: await info_dashboard({
                type: 'lucro_total',
                previous_date: date_object.current_date,
                current_date: date_object.current_date,
                quantidade_vendas: true
            }),
            //, Lucro Semanal //
            lucro_semanal: await info_dashboard({
                type: 'lucro_total',
                previous_date: date_object.week,
                current_date: date_object.current_date,
                quantidade_vendas: true
            }),
            //, Lucro Mensal //
            lucro_mensal: await info_dashboard({
                type: 'lucro_total',
                previous_date: date_object.month,
                current_date: date_object.current_date,
                quantidade_vendas: true
            }),
        }
        res.status(200).json({ info: { vendas: vendas, produtos: produtos } })
    } catch (error) {
        res.status(error.status || 400).json({ info: error.message })
    }
})
/*--------------*/

export default router