/*
                                         # COMO FUNCIONA ?

..                                  IRÁ CONSTRUIR UMA QUERY WHERE

, await BuilderWhere({
,     query: query,
,     f_valor_produtos: {
,         condition: f_valor_produtos,
,         filter: [
,             {
,                 where: {
,                     where: ['f_valor_produtos', '>', Number(f_valor_produtos) - 1],
,                     andWhere: ['f_valor_produtos', '<', Number(f_valor_produtos) + 1],
,                     orWhere: {
,                         where: ['f_valorFornecedor_produtos', '>', Number(f_valor_produtos) - 1],
,                         andWhere: ['f_valorFornecedor_produtos', '<', Number(f_valor_produtos) + 1],
,                     }
,                 }
,             },
,         ]
,     },
,     s_nome_produtos: {
,         condition: s_nome_produtos,
,         filter: [
,             { andWhere: ['s_nome_produtos', "like", `%${s_nome_produtos}%`] }
,         ]
,     },
,     s_fornecedor_produtos: {
,         condition: s_fornecedor_produtos,
,         filter: [
,             { where: ['s_fornecedor_produtos', 'like', `%${s_fornecedor_produtos}%`] }
,         ],
,     },
,     i_estoque_produtos: {
,         condition: i_estoque_produtos,
,         filter: [
,             { where: ['i_estoque_produtos', '=', i_estoque_produtos] }
,         ]
,     }
, })

.. A QUERY SERÁ CONSTRUÍDA UTILIZANDO DE OBJETOS, ARRAYS. 
.. A CONSTRUÇÃO DA QUERY, CONDIÇÕES, ESTÃO EM ORDEM CRONOLÓGICA, ISSO SE APLICA Á TUDO, EX; AS CLÁUSULAS NO 'filter'. 
.. AS PROPRIEDADES QUE ESSE 'BuilderWhere' RECEBE, SÃO:
,
, --query--; irá receber a query, obrigatório.
,
.. EXISTE UMA PROPRIEDADE QUE NÃO POSSUE NOME. ELA PRECISA DE UM NOME PARA IDENTIFICA-LO, PORÉM, ESSE NOME NÃO PODE SER REPETIDO.
.. ELA RECEBE UM OBJETO QUE IRÁ CONSTRUIR A QUERY. EX;
,
, s_nome_produtos: {
,     condition: s_nome_produtos,
,     filter: [
,         { andWhere: ['s_nome_produtos', "like", `%${s_nome_produtos}%`] }
,     ]
, },
,
.. SUAS PROPRIEDADES SÃO;
,
, --condition--; a condição para construir a condição da query. (true/false)
,
.. PROPRIEDADE 'filter' IRÁ CONSTRUIR AS CONDIÇÕES DA QUERY, RECEBENDO UM ARRAY DE OBJETOS, CADA VALOR DESSE ARRAY IRÁ CONSTRUIR UMA CONDIÇÃO. EX;
,
, filter: [
,     { where: ['Exemplo', 'like', `%Exemplo%`] },
,     { where: ['Exemplo2', 'like', %Exemplo2%`] },
,     { where: ['Exemplo3', 'like', %Exemplo3%`] },
, ]
,
.. OU, PARA CONDIÇÕES AGRUPADAS COM PARÊNTESES
,
, filter: [
,     {
,         where: {
,             where: ['Exemplo', '>', Number(Exemplo) - 1],
,             andWhere: ['Exemplo', '<', Number(Exemplo) + 1],
,             orWhere: {
,                 where: ['Exemplo2', '>', Number(Exemplo2) - 1],
,                 andWhere: ['Exemplo2', '<', Number(Exemplo2) + 1],
,             }
,         }
,    },
, ]
,

.. A CONSTRUÇÃO DAS CONDIÇÕES DA QUERY, SERÁ FEITA A PARTIR DE UM ARRAY.
,
, 1º valor será a coluna que sera utilizada,
, 2º valor será o operador utilizado,
, 3º valor será o valor que será comparado com as outras coluna. ex;
,
, where: ['tabela_coluna', 'like', `valor`],
,

.. O NOME DA PROPRIEDADE DE CADA VALOR DO ARRAY SERÁ A CLÁUSULA DA CONDIÇÃO. PODEMOS TOMAR COMO EXEMPLO 's_nome_produtos', 
.. ELA IRÁ REALIZAR A CONDIÇÃO ('s_nome_produtos', "like", `%${s_nome_produtos}%`), COM A CLÁUSULA 'andWhere'. 

.. EXISTE UMA CLÁUSULA ESPECIAL, 'whereRaw', ELA APENAS ACEITA FUNÇÕES. PARA SER CONSTRUÍDA A CONDIÇÃO, VOCÊ IRÁ PRECISAR
.. RETORNAR UM OBJETO CONTENDO AS PROPRIEDADES; 'condition' E 'values', NA PRÓPRIA FUNÇÃO. 

.. 'condition' SERIA A CONDIÇÃO DO 'whereRaw', SOMENTE STRING. ex: 'YEAR(d_data_vendas) = ?', 
.. 'values' SERIA OS VALORES QUE IRÃO SER SUBSTITUÍDOS PELA '?', SOMENTE ARRAY. ex; [ 12 ]

*/

async function BuildWhere(query, clausule_key, clausule_value, error) {
    //.. Raw //
    if (clausule_key === 'whereRaw') {
        if (typeof clausule_value === 'function') {
            const { condition, values } = await clausule_value()
            query.whereRaw(condition, values)
        } else {
            error.msg = `clausule_value; '${clausule_value}' Inválido, Precisa ser uma 'function', pois o filter é 'whereRaw'.`
        }
        return
    }

    //.. Array //
    if (Array.isArray(clausule_value)) return query[clausule_key](...clausule_value)

    //.. Group //
    const group_main_keys = Object.keys(clausule_value)
    if (group_main_keys.length > 0) {
        function handle_group(builder, keys, values) {
            keys.forEach((key) => {
                const value = values[key]
                if (Array.isArray(value)) {
                    builder[key](...value)
                } else {
                    const secondary_keys = Object.keys(value)
                    builder[key]((sub_builder) => {
                        handle_group(sub_builder, secondary_keys, value)
                    })
                }
            })
        }
        query[clausule_key]((builder) => {
            handle_group(builder, group_main_keys, clausule_value)
        })
        return
    }
    error.msg = `clausule_value; '${clausule_value}' Inválido, Não Se Enquadra Em Nenhum.`
}

export default async function BuilderWhere(builder) {
    let error = {
        msg: undefined
    }

    const { query } = builder
    if (!query) {
        error.msg = 'A Query Não Existe, Valor Nulo, Vazio.'
    }

    if (!error.msg) {
        for (const field in builder) {
            if (field === 'query') continue

            const { condition, filter } = builder[field]

            if (condition) {
                for (const filter_value of filter) {
                    const clausule_key = Object.keys(filter_value)[0]
                    const clausule_value = filter_value[clausule_key]
                    await BuildWhere(query, clausule_key, clausule_value, error)
                    if (error.msg) break;
                }
            }

            if (error.msg) break;
        }
    }

    if (error.msg) {
        console.error(`;------- Error BuilderWhere -------; ${error.msg}`)
    }
}
