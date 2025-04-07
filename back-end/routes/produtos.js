//# Import //

import express from 'express';
import cors from 'cors';
import multer_imageStorage from '../config/multer.js'

import RequiredVariables from '../helpers/RequiredVariables.js'
import BuilderWhere from '../helpers/Builder/BuilderWhere.js'
import { BuildPagCursor } from '../helpers/Pagination/cursor_based.js'
import BuilderUpdate from '../helpers/Builder/BuilderUpdate.js';
import { verifyMimeType } from '../helpers/Img.js';
import { accessFile, unlinkFile, resizeFile } from '../helpers/Fs/fsHelpers.js'

import fs from 'fs'

import { db_gestaoprodutosvendas } from '../db/db_config.js';
import port from '../config/port.js';
import HTTPError from '../helpers/Classes/HTTPError.js';


//# Variáveis Globais / Config //

//.. Router //
const router = express.Router()

//.. Limit //    
//-- Limite Quantidade De Dados, Cada REQ GET // 
const limit = 20

//.. IMAGE STORAGE //
const { tempUpload, multer, dirPermanent, dirExpStatic } = multer_imageStorage({
    permanent_path: 'produtos',
    temp_path: 'temp_produtos'
})

/*--------------*/
//# ROTAS //

const rotaExpressStatic = "/imagens"

const rotaGetPadrao = "/"
const rotaGetFiltrar = "/filtrar"
const rotaPostProduto = "/"
const rotaPostUpload = "/upload"
const rotaPutPadrao = "/:id"
const rotaDeletePadrao = "/:id"

//# Middlewares Globais //

router.use(cors())
router.use(rotaExpressStatic, express.static(dirExpStatic))

//.. Rota Get Padrão //
router.get(rotaGetPadrao, async (req, res) => {
    const { cursor } = req.query
    try {
        let query = db_gestaoprodutosvendas('produtos')

        await BuildPagCursor(query, { cursor, column: 'i_id_produtos' })
        query.limit(limit)

        const produtos = await query
        res.status(200).json(produtos);
    } catch (error) {
        res.status(error.status || 400).json({ info: error.message })
    }
});

//.. Rota Filtrar //
router.get(rotaGetFiltrar, async (req, res) => {
    const { cursor, s_nome_produtos, s_fornecedor_produtos, f_valor_produtos, i_estoque_produtos } = req.query

    try {
        let query = db_gestaoprodutosvendas("produtos");

        await BuilderWhere({
            query: query,
            f_valor_produtos: {
                condition: f_valor_produtos,
                filter: [
                    {
                        where: {
                            where: ['f_valor_produtos', '>', Number(f_valor_produtos) - 1],
                            andWhere: ['f_valor_produtos', '<', Number(f_valor_produtos) + 1],
                            orWhere: {
                                where: ['f_valorFornecedor_produtos', '>', Number(f_valor_produtos) - 1],
                                andWhere: ['f_valorFornecedor_produtos', '<', Number(f_valor_produtos) + 1],
                            }
                        }
                    },
                ]
            },
            s_nome_produtos: {
                condition: s_nome_produtos,
                filter: [
                    { andWhere: ['s_nome_produtos', "like", `%${s_nome_produtos}%`] }
                ]
            },
            s_fornecedor_produtos: {
                condition: s_fornecedor_produtos,
                filter: [
                    { where: ['s_fornecedor_produtos', 'like', `%${s_fornecedor_produtos}%`] }
                ],
            },
            i_estoque_produtos: {
                condition: i_estoque_produtos,
                filter: [
                    { where: ['i_estoque_produtos', '=', i_estoque_produtos] }
                ]
            }
        })
        await BuildPagCursor(query, { cursor, column: 'i_id_produtos' })

        query.select('*')
        query.limit(limit)
        const produtos = await query

        res.status(200).json(produtos)
    } catch (error) {
        res.status(error.status || 400).json({ info: error.message })
    }
})

//.. Rota Post (Adicionar Produto) //

//, Produto //
router.post(rotaPostProduto, async (req, res) => {

    const {
        s_nome_produtos,
        s_fornecedor_produtos,
        f_valor_produtos,
        f_valorFornecedor_produtos,
        i_estoque_produtos,
        i_desconto_produtos = 0,
        s_img_produtos,
    } = req.body

    const { path, finalPath } = s_img_produtos
    let query = db_gestaoprodutosvendas("produtos")
    try {

        //.. Verify // 
        await RequiredVariables({
            s_nome_produtos,
            s_fornecedor_produtos,
            f_valor_produtos,
            f_valorFornecedor_produtos,
            i_estoque_produtos
        })
        if (i_desconto_produtos > 100 || i_desconto_produtos < 0) {
            throw new HTTPError('Desconto Inválido. (0% - 100%)', 400)
        }

        //.. Adding Product //
        if (path && finalPath) {
            const { filename } = await resizeFile(path, finalPath)
            const { originalUrl } = req

            if (!filename || !originalUrl) {
                await unlinkFile(path)
                throw new Error(`Error filename/originalUrl, Valores nulos.`)
            }

            await unlinkFile(path)
            //.. With IMG //
            query = query.insert({
                s_nome_produtos,
                s_fornecedor_produtos,
                f_valor_produtos,
                i_estoque_produtos,
                f_valorFornecedor_produtos,
                i_desconto_produtos,
                s_img_produtos: `http://localhost:${port}${originalUrl}/imagens/produtos/${filename}`
            })

        } else {
            //.. Without IMG //
            query = query.insert(
                {
                    s_nome_produtos,
                    s_fornecedor_produtos,
                    f_valor_produtos,
                    i_estoque_produtos,
                    i_desconto_produtos,
                    f_valorFornecedor_produtos
                })
        }
        const id = await query

        res.status(201).json({ info: id[0] })
    } catch (error) {
        if (s_img_produtos) {
            if (await accessFile(path, fs.constants.F_OK, { console_error: false })) await unlinkFile(path)
            if (await accessFile(finalPath, fs.constants.F_OK, { console_error: false })) await unlinkFile(finalPath)
        }
        res.status(error.status || 400).json({ info: error.message })
    }
});

//, Imagem // 
router.post(rotaPostUpload, tempUpload.single('s_img_produtos'), async (req, res) => {
    if (!req.file) {
        res.status(400).json({ info: 'Arquivo IMG Inválida. (File)' })
        return
    }

    const { path, filename } = req.file
    try {
        await verifyMimeType(path, { err_obj: true })
        if (!await accessFile(dirPermanent, fs.constants.F_OK)) {
            throw new Error(`Inválido 'dirPermanent' ${dirPermanent}`)
        }
        if (!await accessFile(path, fs.constants.F_OK)) {
            return
        }
        res.status(200).json({
            info: {
                path: path,
                finalPath: `${dirPermanent}/${filename}`
            }
        })
    } catch (error) {
        await unlinkFile(path)
        res.status(error.status || 400).json({ info: error.message })
    }
})
//.. Middleware Que Lida Com O Error Do Multer //
router.use(rotaPostUpload, (error, req, res, next) => {
    const error_multer = error instanceof multer.MulterError
    error_multer ? res.status(400).json({ info: `MulterError; ${error.message}` }) : res.status(500).json({ info: 'MulterError; Error interno server' })
});

//.. Rota Put Padrão (Modificar Registros) //
router.put(rotaPutPadrao, async (req, res) => {
    const { id } = req.params
    const {
        s_nome_produtos,
        s_fornecedor_produtos,
        f_valor_produtos,
        i_estoque_produtos,
        f_valorFornecedor_produtos,
        i_desconto_produtos
    } = req.body
    try {
        const query = db_gestaoprodutosvendas("produtos")
        await BuilderWhere({
            query: query,
            id: {
                condition: id,
                filter: [{ where: ['i_id_produtos', '=', id] }]
            }
        })
        await BuilderUpdate({
            query: query,
            s_nome_produtos: { condition: s_nome_produtos, new_value: s_nome_produtos },
            s_fornecedor_produtos: { condition: s_fornecedor_produtos, new_value: s_fornecedor_produtos },
            f_valor_produtos: { condition: f_valor_produtos, new_value: f_valor_produtos },
            f_valorFornecedor_produtos: { condition: f_valorFornecedor_produtos, new_value: f_valorFornecedor_produtos },
            i_estoque_produtos: { condition: i_estoque_produtos || i_estoque_produtos === 0, new_value: i_estoque_produtos },
            i_desconto_produtos: { condition: i_desconto_produtos, new_value: i_desconto_produtos }
        })

        const res_query = await query
        if (res_query !== 0) {
            res.status(200).json({ info: "Registro Atualizado" })
        } else {
            throw new HTTPError('Registro Não Encontrado', 404)
        }
    } catch (error) {
        res.status(error.status || 400).json({ info: error.message })
    }
});

//.. Rota Delete Padrão (Deleta Registros) //
router.delete(rotaDeletePadrao, async (req, res) => {
    const { id } = req.params
    try {
        let query = db_gestaoprodutosvendas("produtos")

        await BuilderWhere({
            query: query,
            id: {
                condition: id,
                filter: [{ where: ['i_id_produtos', '=', id] }]
            }
        })

        const { s_img_produtos: img_path } = await query.select("s_img_produtos").first()

        //- 'server_imagem' se refere, a pasta 'data.imgData.server_imagem', No Back-End, Onde Se Armazena Imagens Do Servidor.
        //- Caso Modifique O Nome, Terá Que Modificar O Nome Da Pasta.

        if (img_path && !img_path.includes('server_imagem')) {
            const filename = img_path.split('/').pop()
            const registroImgPATH = `${dirPermanent}/${filename}`
            if (await accessFile(registroImgPATH, fs.constants.F_OK)) {
                if (!await unlinkFile(registroImgPATH, { return_boolean: true })) {
                    throw new HTTPError(`Houve um error ao tentar deletar; ${registroImgPATH}`)
                }
            }
        }

        await query.del()
        res.status(200).json({ info: "Registro Excluido" })
    } catch (error) {
        res.status(error.status || 400).json({ info: error.message })
    }
})

/*--------------*/

export default router