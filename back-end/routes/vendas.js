//# Import //

import express from 'express';
import cors from 'cors';

import RequiredVariables from '../helpers/RequiredVariables.js'
import BuilderWhere from '../helpers/Builder/BuilderWhere.js'
import { formatTable_Date, format_StringDate } from '../helpers/Date/format_date.js'
import { BuildPagCursor } from '../helpers/Pagination/cursor_based.js'

import { db_controle_estoque } from '../db/db_config.js';

//# Variáveis Globais //

//.. Router //
const router = express.Router()

//.. Limit //    
const limit = 50

//# Middlewares Globais //

router.use(cors())

/*--------------*/
//# ROTAS //

const rotaGetPadrao = "/"
const rotaGetFiltrar = "/filtrar"
const rotaPostVenda = "/"
const rotaDeletePadrao = "/:id"

//.. Rota Get Padrão //
router.get(rotaGetPadrao, async (req, res) => {
    const { cursor } = req.query
    try {
        let query = db_controle_estoque('vendas')

        await BuildPagCursor(query, { cursor, column: 'i_id_vendas' })
        query.limit(limit)

        const vendas = await query
        await formatTable_Date(vendas, 'd_data_vendas')

        res.status(200).json(vendas);
    } catch (error) {
        res.status(400).json({ info: error.message })
    }
});

//.. Rota Post Padrão (Adicionar Vendas) //
router.post(rotaPostVenda, async (req, res) => {
    const {
        s_nome_vendas,
        s_fornecedor_vendas,
        f_valorFornecedor_vendas,
        f_valor_vendas,
        i_quantidade_vendas,
        d_data_vendas,
        i_desconto_vendas
    } = req.body

    if (RequiredVariables({ s_nome_vendas, s_fornecedor_vendas, f_valor_vendas, f_valorFornecedor_vendas, d_data_vendas }, res)) {
        return
    }

    //.. Verify // 
    const Error =
        (i_quantidade_vendas > 100 || i_quantidade_vendas <= 0) ?
            'Quantidade Inválida. (1 - 100)'
            : i_desconto_vendas > 100 || i_desconto_vendas < 0 ?
                'Desconto Inválido. (0% - 100%)'
                : undefined
    if (Error) return res.status(400).json({ info: Error })

    try {
        const query = db_controle_estoque('vendas')

        const { d_data_vendas: formattedDate } = await format_StringDate({
            type: 'standard',
            verify: true,
            date: { d_data_vendas }
        })


        let sales_ID = []
        for (let i = 0; i < i_quantidade_vendas; i++) {
            const sale_ID = await query.insert({
                s_nome_vendas,
                s_fornecedor_vendas,
                f_valorFornecedor_vendas,
                f_valor_vendas,
                d_data_vendas: formattedDate,
                i_desconto_vendas
            })
            sales_ID.push(sale_ID[0])
        }
        res.status(201).json({ info: sales_ID })
    } catch (error) {
        res.status(400).json({ info: error.message })
    }
});

//.. Rota Delete Padrão (Deleta Registros) //
router.delete(rotaDeletePadrao, async (req, res) => {
    const { id } = req.params
    try {
        let query = db_controle_estoque('vendas')
        await BuilderWhere({
            query: query,
            id: {
                condition: id,
                filter: [{ where: ['i_id_vendas', '=', id] }]
            }
        })
        await query.del()
        res.status(200).json({ info: "Registro Excluido" })
    } catch (error) {
        res.status(400).json({ info: error.message })
    }
})

//.. Rota Filtrar //
router.get(rotaGetFiltrar, async (req, res) => {
    const { cursor, s_nome_vendas, f_valor_vendas, s_fornecedor_vendas, d_data_vendas } = req.query

    try {
        let query = db_controle_estoque("vendas");
        await BuilderWhere({
            query: query,
            f_valor_vendas: {
                condition: f_valor_vendas,
                filter: [
                    {
                        where: {
                            where: ['f_valor_vendas', '>', Number(f_valor_vendas) - 1],
                            andWhere: ['f_valor_vendas', '<', Number(f_valor_vendas) + 1],
                            orWhere: {
                                where: ['f_valorFornecedor_vendas', '>', Number(f_valor_vendas) - 1],
                                andWhere: ['f_valorFornecedor_vendas', '<', Number(f_valor_vendas) + 1],
                            }
                        }
                    },
                ]
            },
            s_nome_vendas: {
                condition: s_nome_vendas,
                filter: [
                    { where: ["s_nome_vendas", "like", `%${s_nome_vendas}%`] }
                ]
            },
            s_fornecedor_vendas: {
                condition: s_fornecedor_vendas,
                filter: [
                    { where: ["s_fornecedor_vendas", "like", `%${s_fornecedor_vendas}%`] }
                ]
            },
            d_data_vendas: {
                condition: d_data_vendas,
                filter: [{
                    whereRaw: async () => {
                        const raw_objDate = await format_StringDate({ type: 'object', date: { d_data_vendas } })
                        const objDate = raw_objDate.d_data_vendas

                        return Object.entries(objDate).reduce((whereRaw, [key, currentDate]) => {
                            if (currentDate) {
                                whereRaw.condition += `${whereRaw.condition && ' AND '}${key.toUpperCase()}(d_data_vendas) = ?`
                                whereRaw.values.push(currentDate)
                            }
                            return whereRaw
                        }, { condition: '', values: [] })
                    }
                }
                ]
            }
        })
        await BuildPagCursor(query, { cursor, column: 'i_id_vendas' })
        query.limit(limit)

        const vendas = await query
        await formatTable_Date(vendas, 'd_data_vendas')

        res.status(200).json(vendas);
    } catch (error) {
        res.status(400).json({ info: error.message })
    }
})

/*--------------*/

export default router