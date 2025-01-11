/* 
                                                # COMO FUNCIONA ?

..                                  CADA FUNÇÃO, IRÁ FORMATAR, VERIFICAR DATAS.
-
- ---format_StringDate---
-
.. IRÁ FORMATAR DATAS, ACEITANDO APENAS O FORMATO PADRÃO DO PROJETO; 'Y0000M00D00', COM VALORES ACIMA OU IGUAL Á '0100-01-01', EX;
, const formattedDate = await format_StringDate({
,     type: 'standard',
,     verify: true,
,     date: d_data_vendas
, }) 
,
.. AS PROPRIEDADES SÃO; 
, --type--; o tipo de formatação, precisando ser uma data no formato padrão do projeto. tomando como exemplo; 'Y1231M00D01'
,
, - formatos -
, 'object': { year: 1231, month: undefined, day: 01 }
, 'standard': 1231-00-02
,
, --verify--; aceita somente 'true/false', irá verificar a data de acordo com o 'MySQL'.
, --date--; as datas á ser fomatada, o valor passado sempre será um objeto, ou não funcionará
,
-
- ---format_ISO8601---
-
.. IRÁ FORMATAR DATAS ISO8601; 2024-06-19T03:00:00.000Z, DE UM REGISTRO. IRÁ RECEBER UM OBJETO CONTENDO A DATA Á SER FORMATADA, E O FORMATO. EX; 
, format_ISO8601({
,     row: current_row,
,     date_format: 'yyyy/MM/dd',
,     date_column: column
, })
,
.. SUAS PROPRIEDADES SÃO;
,
, --row--; o registro que contém a data á ser formatada.
, --date_format--; a formatação da data, ex; 'yyyy/MM/dd'.
, --date_column--; a coluna que contém a data á ser formatada no registro.
,
-
- ---formatTable_Date---
- 
.. AVISO; O NOME DA COLUNA DA DATA PRECISA SER O MESMO EM TODOS OS REGISTROS, CASO NÃO, NÃO IRÁ FUNCIONAR CORRETAMENTE.

.. IRÁ FORMATAR DATAS ISO8601, COMO 'format_ISO8601', PORÉM, PODENDO FORMATAR UMA TABELA TODA DE REGISTROS. IRÁ RECEBER ARGUMENTOS. EX; 
,
, await formatTable_Date(vendas, 'd_data_vendas')
,
.. SEUS ARGUMENTOS SÃO;
,
, --table_data--; os registros da tabela á ser formatada, não precisando ser uma tabela, apenas um vetor de objetos que contem uma data em todos eles.
, --column--; a coluna que contém a data á ser formatada nos registros da tabela.
,
*/
//# Import //

import { format, formatDate } from 'date-fns'
import HTTPError from '../Classes/HTTPError.js'

//# Funções Exportadas //

//.. format_StringDate //
export async function format_StringDate(format) {
    return new Promise((resolve, reject) => {
        let msgError;
        if (!format.date || !format.type) {
            msgError = msgError ?? `ARGUMENTO 'FORMAT', VALOR ESSENCIAL NULO`
        }

        const date = format.date
        const date_keys = Object.keys(date)

        let formattedDate = {}
        for (let i = 0; i < date_keys.length; i++) {
            const current_key = date_keys[i]
            const current_date = date[current_key]
            
            const matchDate = current_date.match(/\d+/g)
            if (!matchDate) {
                msgError = msgError ?? `ERROR MATCH '${date}'`
            }
            if ((!/^[YMD0-9]+$/.test(current_date) || !current_date.length === 11) && !msgError) {
                msgError = msgError ?? `FORMATO ${current_date} INVÁLIDO.`
            }

            if (format.verify && !msgError) {
                const year = matchDate[0]
                const month = matchDate[1]
                const day = matchDate[2]

                const date = new Date(year, month - 1, day)
                if (date.getFullYear() !== parseInt(year, 10) || date.getMonth() !== month - 1 || date.getDate() !== parseInt(day, 10)) {
                    msgError = msgError ?? `DATA INVÁLIDA, NÃO CORRESPONDE AO CALENDÁRIO.`
                }
            }

            //.. Types //
            if (!msgError) {

                formattedDate[current_key] =
                    //, Object //
                    format.type === 'object' ?
                        {
                            year: matchDate[0] !== '0000' ? matchDate[0] : undefined,
                            month: matchDate[1] !== '00' ? matchDate[1] : undefined,
                            day: matchDate[2] !== '00' ? matchDate[2] : undefined,
                        }
                        :
                        //, Standard //
                        format.type === 'standard' ?
                            `${matchDate[0]}-${matchDate[1]}-${matchDate[2]}`
                            : undefined

            }
        }
        if (Object.keys(formattedDate).length > 0) {
            return resolve(formattedDate)
        }
        if (msgError) {
            return reject(new Error(msgError))
        }
    })
}

//.. format_ISO8601 //
export async function format_ISO8601(format_obj) {
    return new Promise((resolve, reject) => {
        const { row, date_format, date_column } = format_obj
        const old_date = row

        let formatted_date = format(row[date_column], date_format)
        row[date_column] = row && formatted_date;
        old_date !== formatted_date ? resolve(formatted_date) : reject(new Error(`;------- Error format_ISO8601 -------; ERROR AO FORMATAR ${date}`));
    })
}

//.. formatTable_Date //
export async function formatTable_Date(table_data, column) {
    if (!table_data || !column) {
        console.log(';------- Error formatTable_Date -------; Argumentos Necessários Nulos (data, ou column)')
        return
    }
    try {
        let promises = []
        for (let i = 0; i < table_data.length; i++) {
            const current_row = table_data[i]
            promises.push(
                format_ISO8601({
                    row: current_row,
                    date_format: 'yyyy/MM/dd',
                    date_column: column
                })
            )
        }
        await Promise.all(promises)
    } catch (formatError) {
        console.error(`;------- Error formatDate -------;`, formatError.message)
        throw new HTTPError(formatError.message, 500)
    }
}