/* 
                                                # COMO FUNCIONA ?

..                              IRÁ CONSTRUIR UMA QUERY UPDATE, COM OS CAMPOS QUE RECEBE.
..            AVISO; A QUERY PRECISA CONTER APENAS 1 REGISTRO ANTECIPADAMENTE, CASO CONTENHA MAIS, NÃO IRA FUNCIONAR.



.. 'BuilderUpdate' IRÁ RECEBER UM OBJETO, CONTENDO AS INFORMAÇÕES DA QUERY, O 'config_update', 
.. QUE VAI CONSTRUIR A QUERY UPDATE COM BASE NESSE OBJETO. EXEMPLO;
,
, await BuilderUpdate({
,     query: query,
,     s_nome_produtos: { condition: s_nome_produtos, new_value: s_nome_produtos },
,     s_fornecedor_produtos: { condition: s_fornecedor_produtos, new_value: s_fornecedor_produtos },
,     f_valor_produtos: { condition: f_valor_produtos, new_value: f_valor_produtos },
,     f_valorFornecedor_produtos: { condition: f_valorFornecedor_produtos, new_value: f_valorFornecedor_produtos },
,     i_estoque_produtos: { condition: i_estoque_produtos || i_estoque_produtos === 0, new_value: i_estoque_produtos }
, })
,
.. AS PROPRIEDADES QUE ESSE OBJETO RECEBE, SÃO:
,
, --query--; irá receber a query, basicamente a base.
, 
.. TEMOS UMA PROPRIEDADE QUE NÃO TEM NOME ESPECÍFICO, O NOME IRÁ SER O NOME DA COLUNA DO REGISTRO QUE VOCE IRÁ REALIZAR O UPDATE PARA O NOVO VALOR. EXEMPLO;
,
, s_nome_produtos: { condition: s_nome_produtos, new_value: s_nome_produtos },
, 
.. ESSA PROPRIEDADE, VAI CONTER UM OBJETO, CONTENDO AS CONFIGURAÇÕES DA QUERY UPDATE. SUAS PROPRIEDADES SÃO;
,
, --condition--; a condição para realizar o update, caso seja falso, não irá ser realizado.
, --new_value--; o novo valor do registro, caso 'condition' seja verdadeiro.
, 
*/

export default async function BuilderUpdate(config_update) {
    let msgError;
    
    const query = config_update.query
    if (!query) {
        msgError = 'A Query Não Existe, Valor Nulo, Vazio.'
    }
    if(!msgError){
        for (const column in config_update) {
            if (column === 'query') continue
            
            const { condition, new_value } = config_update[column]
            if(condition){
                query.update({ [column]: new_value })
            }
        }
    }
    if (msgError) {
        console.error(`;------- Error BuilderUpdate -------; ${msgError}`)
    }
}