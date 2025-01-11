/*
                                                     # COMO FUNCIONA ?
 
 -- 'actionDelete', 'actionAlterar', 'actionAdd' FAZEM REQUESTS A UM SERVIDOR, SÓ FUNCIONARÁ CASO TENHA UM SERVIDOR, E 'Rotas' FUNCIONAIS. --

 .. ESSE COMPONENTE IRÁ JUNTAR OS COMPONENTES 'ListaTHEAD' E 'ListaTBODY' PARA EXIBIR UMA LISTA. EXEMPLO DE SUA UTILIZAÇÃO:
 ,
 , <Lista
 ,  tHeadTh={tHeadThPRODUTOS}
 ,  tBodyTr={tBodyTrPRODUTOS}
 ,  tBodyTd={tBodyTdPRODUTOS}
 ,  Registros={Registros}
 ,  Rota='produtos'
 ,  actionDel={{ title: 'Excluir Produtos', message: 'Tem Certeza? O Produto Não Poderá Ser Mais Consultado, Após Deleta-lo.' }}
 ,  actionAdd={{
 ,  actionAdd={{
 ,      rota: 'vendas',
 ,      title: 'Adicionar Vendas',
 ,      type: {
 ,          name: 'sales',
 ,          rota: 'produtos',
 ,          column: { storage_value: 'i_estoque_produtos', quantity_sales: 'i_quantidade_vendas' },
 ,          error_message: {
 ,              storage_value: 'Estoque Igual Á 0 Ou Menor; Impossível Adicionar Novas Vendas',
 ,              quantity_sales: 'Quantidade Vendas Inválida; Ultrapassou Estoque'
 ,          }
 ,      },
 ,      data: {
 ,          s_nome_vendas: { column: 's_nome_produtos' },
 ,          f_valor_vendas: {
 ,              column: 'f_valor_produtos',
 ,              config_value: {
 ,                   desconto: 'i_desconto_produtos'
 ,              }
 ,          },
 ,          d_data_vendas: { value: CurrentDate() },
 ,          i_quantidade_vendas: {
 ,              prompt: { message: `Quantidade? (Digite -1 Para Cancelar)`, cancel: '-1', },
 ,              config_value: {
 ,                   default: 1,
 ,                   verify: {
 ,                       type: 'int',
 ,                       max: 100,
 ,                       min: 1,
 ,                       error_message: 'Quantidade Inválida; Entre 1 á 100'
 ,                   }
 ,              }
 ,          }
 ,      }
 ,  }}
 ,  actionAlt={{
 ,      props: [
 ,          { column: 's_nome_produtos', prompt: 'Digite o Novo Nome:', type: 'string' },
 ,          { column: 's_fornecedor_produtos', prompt: 'Digite O Novo Fornecedor:', type: 'string' },
 ,          { column: 'f_valor_produtos', prompt: 'Digite o Novo Preço:', type: 'cash' },
 ,          { column: 'f_valorFornecedor_produtos', prompt: 'Digite o Novo Preço De Fábrica:', type: 'cash' },
 ,          { column: 'i_estoque_produtos', prompt: 'Digite A Nova Quantidade De Produtos:', type: 'int' }
 ,      ]
 ,  }}
 , />
 ,
 -
 - ---'tHeadTh'---
 -
 .. 'tHeadTh' IRÁ CONTER O 'THead' DA LISTA, CADA OBJETO NO VETOR PRECISA ESTÁ EM ORDEM,
 .. O PRIMEIRO 'tr' PRECISA SER O PRIMEIRO, O SEGUNDO 'tr' PRECISA SER O SEGUNDO NO VETOR..., 
 .. A RENDERIZAÇÃO IRÁ SEGUIR ESSA ORDEM.
 ,
 , const tHeadTh = [
 ,  { innerText: 'Cód', id: 'thCod' }, 
 ,  { innerText: 'Nome', className: 'th-head' },
 ,  { innerText: 'Ações', className: 'th-head--acões' } 
 , ]
 ,
 .. PROPRIEDADES:
 , --innerText--; conterá o txt do thead
 , --className--; classname para o th do thead 
 , --id--; id para o th do thead (txt)
 -
 - ---'tBodyTd'---
 -
 .. 'tBodyTd' IRÁ SER UM OBJETO PARA CADA 'td' DO 'TBody'. EXEMPLO:
 ,
 , const tBodyTd = [
 ,     {
 ,        column: 'i_id_produtos',
 ,        className: 'tr-produtos__td-body-id'
 ,     },
 ,     {
 ,        column: 's_nome_produtos',
 ,        className: 'tr-produtos__td-body-nome',
 ,        title: 'Alterar Nome'
 ,     },
 ,     {
 ,        column: 's_fornecedor_produtos',
 ,        className: 'tr-produtos__td-body-fornecedor',
 ,        title: 'Alterar Fornecedor'
 ,     },
 ,     {
 ,        column: 'f_valor_produtos',
 ,        className: 'tr-produtos__td-body-valor',
 ,        title: 'Alterar Preço R$',
 ,        cash: true
 ,     }
 , ]
 ,
 .. PROPRIEDADES:
 , --column--; o nome da chave em 'ListaRegistros' que o td vai exibir,
 , --className--; classname de td,
 , --title--; title de td,
 , --img--; caso o dado recebido seja uma img, ex: (http://localhost:3000/imagens/no-image-icon.png), para renderizar a imagem corretamente, (true/false)
 , --date--; caso o dado seja uma data (true/false)
 , --cash--; caso o dado faz referencia á dinheiro (true/false)
 , --percentage--; caso o dado seja uma %, irá exibir como se fosse uma %.
 , --desconto--; Aplica um desconto percentual ao valor de um 'td' com base em uma coluna que define o percentual de desconto. 
 , o td que contém o valor e a coluna de contém o percentual desconto devem ser valores numéricos. Para definir a coluna que contém o percentual de desconto, 
 , especifique o nome da coluna que contém o percentual, na propriedade. Por exemplo: desconto: 'i_desconto_produtos'.
 ,
 -
 - ---'Registros'---
 -
 .. ESTÁ PARTE É MAIS COMPLICADA, AS 'column' DO 'td' DE 'TBody' ESTÁ RELACIONADA COM 'Registros' QUE RECEBERÁ DADOS EM UM PADRÃO
 .. QUE CASO SEJA NÃO SEJA SEGUIDO, 'Lista' NÃO FUNCIONARÁ CORRETAMENTE. EXEMPLO DE 'Registros':
 ,
 , [
 ,                                     {
 ,  i_id_produtos: 1,
 ,  s_nome_produtos: exemplo1,
 ,  s_fornecedor_produtos: fornecedor1,
 ,  f_valor_produtos: 10
 , },
 ,                                     {
 ,  i_id_produtos: 2,
 ,  s_nome_produtos: exemplo2,
 ,  s_fornecedor_produtos: fornecedor2,
 ,  f_valor_produtos: 12
 , },
 ,                                     {
 ,  i_id_produtos: 3,
 ,  s_nome_produtos: exemplo3,
 ,  s_fornecedor_produtos: fornecedor3,
 ,  f_valor_produtos: 14
 , }]
 ,
 .. PODEMOS OBSERVAR QUE É O FORMATO PADRÃO DO 'MySQL' QUANDO USAMOS 'SELECT *', TRANSFORMADO EM UM OBJETO JS.
 .. CADA OBJETO EM 'tBodyTd' IRÁ EXIBIR ESSES DADOS OU NÃO, POR ISSO EXISTE A PROPRIEDADE 'column' QUE VAI SER O NOME DA CHAVE DOS OBJETOS
 .. CONTIDOS EM 'Registros'.
 -
 - ---'tBodyTr'---
 -
 .. IRÁ SER UM OBJETO PARA 'tr' DO 'TBody', PRECISAMOS DA 'key' PARA DISTINGUIR OS 'tr'. 'key' IRÁ APONTAR PARA UMA CHAVE DE 'ListaRegistros',
 .. O VALOR DESSA CHAVE PRECISA SER DISTINTO ENTRE TODOS OS 'tr' DENTRO DA LISTA. EXEMPLO:
 ,
 , const tBodyTr = {
 ,    key: 'i_id_produtos'
 , }
 ,
 .. PROPRIEDADES PARA 'tBodyTr', SÃO:
 , --key--; key de cada tr,
 , --className--; classname de cada tr
 -
 - ---'Rota'---
 -
 .. UMA 'Rota' PADRÃO PARA TODAS AS REQUEST DOS 'actions', MENOS 'actionAdd'. CASO A ROTA DO 'action' NÃO SEJA ESPECIFICADA.
 -
 - ---'actions'---
 -
 - --- 'actionDelete' - ---
 -
 .. DELETA UM REGISTRO INTEIRO, PARA USA-LO BASTA FORNECER 'message' DENTRO DE UM OBJETO Á PROPRIEDADE 'actionDel', EXEMPLO:
 ,
 , <Lista
 ,   actionDel={{ 
 ,       title: 'Excluir Produtos', 
 ,       message: 'Tem Certeza? O Produto Não Poderá Ser Mais Consultado, Após Deleta-lo.' 
 ,   }}
 , />
 ,
 .. PROPRIEDADES:
 , --message--; a mensagem exibida que pergunta ao usuario se ele realmente quer excluir o registro, 
 , --title--; o titulo que será exibido quando o usuario passa em cima do botão de exclusão,
 , --Rota--; a rota que será efetuada a requisição de exclusão de um registro,
 ,
 -
 - --- 'actionAlterar' - ---
 -
 .. ALTERA APENAS UM DADO DE UM REGISTRO, PARA USA-LO VOCÊ IRÁ FORNECER 'column'
 .. A 'column' IRÁ IDENTIFICAR QUAL 'column' DE 'tBodyTd' QUE VOCÊ DESEJA PERMITIR QUE O USUARIO CONSIGA ALTERÁ-LA, EXEMPLO:
 ,
 , <Lista
 ,      actionAlterar={[        
 ,                               {
 ,          column: 's_nome_produtos',         
 ,          prompt: 'Digite o Novo Nome:',
 ,          type: 'string'
 ,      },
 ,                              {
 ,          column: 's_fornecedor_produtos',
 ,          prompt: 'Digite O Novo Fornecedor:',
 ,          type: 'string'
 ,      },
 ,                              {
 ,          column: 'f_valor_produtos',
 ,          prompt: 'Digite o Novo Preço:',
 ,          type: 'cash'
 ,      }
 ,     ]
 ,    }
 , />
 ,
 .. PROPRIEDADES:
 , --column--; o nome da column em 'tBodyTd' que vai ser permitida a alteração, 
 , --prompt--; a mensagem exibida durante a digitação do novo valor,
 , --Rota--; a rota que será efetuada a requisição de alteração de um registro,
 , 

 - --- 'type; actionAlterar' - ---

 .. PROPRIEDADE 'type', IRÁ VALIDAR O PROMPT, VALIDAÇÕES POSSÍVEIS:
 , --'string'--; irá permitir apenas string de até 255 caracteres,
 , --'int'--; irá permitir apenas números inteiros, divisivel por 1,
 , --'cash'--; irá permitir apenas números divisivel Por 0.01, menor Que 999999.99
 ,
 -
 - --- 'actionAdd' - ---
 -
 .. IRÁ ADICIONAR NOVOS REGISTROS, PODENDO SER DADOS ESPECIFICOS, DA PROPRIA LISTA, OU DIGITADOS PELO USUARIO, EXEMPLO:
 ,
 , <Lista
 ,  actionAdd={{
 ,      Rota: 'vendas',
 ,      title: 'Adicionar Vendas',
 ,      type: {
 ,          name: 'sales',
 ,          rota: 'produtos',
 ,          column: { storage_value: 'i_estoque_produtos', quantity_sales: 'i_quantidade_vendas' },
 ,          error_message: {
 ,              storage_value: 'Estoque Igual Á 0 Ou Menor; Impossível Adicionar Novas Vendas',
 ,              quantity_sales: 'Quantidade Vendas Inválida; Ultrapassou Estoque'
 ,          }
 ,      },
 ,      data: {
 ,          s_nome_vendas: { column: 's_nome_produtos' },
 ,          f_valor_vendas: {
 ,              column: 'f_valor_produtos',
 ,              config_value: {
 ,                   desconto: 'i_desconto_produtos'
 ,              }
 ,          },
 ,          d_data_vendas: { value: CurrentDate() },
 ,          i_quantidade_vendas: {
 ,              prompt: { message: `Quantidade? (Digite -1 Para Cancelar)`, cancel: '-1', },
 ,              config_value: {
 ,                   default: 1,
 ,                   verify: {
 ,                       type: 'int',
 ,                       max: 100,
 ,                       min: 1,
 ,                       error_message: 'Quantidade Inválida; Entre 1 á 100'
 ,                   }
 ,              }
 ,          }
 ,      }
 ,  }}
 , />
 ,
 .. PROPRIEDADES:
 , --Rota--; a rota que será efetuada a requisição de adição de um novo registro,
 , --title--; o titulo que será exibido quando o usuario passa em cima do botão de adição,
 ,

 - --- 'type; actionAdd' - ---

 .. PROPRIEDADE 'type', IRÁ EXECUTAR EFEITOS COLATERAIS Á ADIÇÃO, GERALMENTE OCORRENDO EM COLUNAS, EX: A ADIÇÃO DE UM NOVO REGISTRO, IRÁ SUBTRAIR 1 DE UMA COLUNA
 .. CADA 'type' TERÁ VERIFICAÇÕES DOS VALORES USADOS NOS EFEITOS COLATERAIS, EX: CASO O VALOR SEJA 0, NÃO TERÁ A SUBTRAÇÃO DE 1, EXIBINDO UMA MENSAGEM DE ERROR
 .. ELE IRÁ CONTER UM OBJETO CONFIGURANDO OS EFEITOS COLATERAIS ESSE OBJETO IRÁ ACEITAR DIVERSAS PROPRIEDADES, SENDO:

 .. 'name', IRÁ ESPECIFICAR O EFEITO COLATERAL EXECUTADO, SENDO:
 , --'sales'--; irá subtrair como padrão 1 de alguma coluna, sendo possível configurar a quantidade subtraída, e a coluna subtraída.
 ,
 , - verificações -
 , -column; caso o valor da coluna seja 0, ou menor que 0, será lançado um error.
 , -quantity; caso o resultado da quantidade menos valor da coluna escolhida seja 0, ou menor que 0, será lançado um error.
 , 
 .. 'rota', IRÁ DEFINIR A ROTA QUE SERÁ EXECUTADA O EFEITO COLATERAL, SENDO USADA COMO ROTA PADRÃO PARA O EFEITO COLATERAL. 

 .. 'column', IRÁ CONFIGURAR OS EFEITOS COLATERAIS DAS COLUNAS, CONFIGURAÇÕES POSSÍVEIS:
 , --'storage_value'--; utilizada em 'sales', irá definir a coluna subtraída, sendo uma coluna da propria lista, definida em 'tBodyTd'. 
 ,
 .. 'data', IRÁ CONFIGURAR OS EFEITOS COLATERAIS USANDO DADOS DE 'data', CONFIGURAÇÕES POSSÍVEIS:
 , --'quantity_sales'--; utilizada em 'sales', irá definir a quantidade subtraída, usando dos valores de 'data'.
 ,
 .. 'error_message', MENSAGEM DE ERROR EXIBIDA CASO SEJA LANÇADO ALGUM ERROR, MENSAGENS POSSÍVEIS:
 , --'storage_value'--; mensagem de error, para a verificação de 'sales' do valor da coluna escolhida para ser subtraída.
 , --'quantity_sales'--; mensagem de error, para a verificação de 'sales' do valor do resultado da quantidade menos a coluna escolhida.
 ,
 - --- 'data; actionAdd' - ---

 .. PROPRIEDADE 'data', OS DADOS DO NOVO REGISTRO. CADA PROPRIEDADE DENTRO DE 'data' IRÁ REPRESENTAR UMA PROPRIEDADE DENTRO DO OBJETO ENVIADO Á O SERVIDOR
 .. EXEMPLO; CASO A ROTA ACEITE APENAS A PROPRIEDADE 'nome_cliente', VOCÊ PODERÁ CRIAR UM OBJETO COM O NOME DA PROPRIEDADE UTILIZADA NA ROTA, { nome_cliente: '' }.
 .. ISSO IRÁ CRIAR UM OBJETO CONTENDO A PROPRIEDADE 'nome_cliente', SEM NOME/VALOR ATRIBUIDO.

 .. PARA ATRIBUIR VALOR Á ESSAS PROPRIEDADES, VOCÊ UTILIZARÁ DE PROPRIEDADES ESPECÍFICAS, SENDO:
 , --value--; irá atribuir qualquer tipo de valor, que pode ser funções, objetos, textos, números, qualquer coisa. 
 , --column--; irá atribuir como valor o valor de uma coluna específica. para utilizá-lo; preencha com o nome da coluna que irá utilizar como valor.
 , sendo uma coluna existente na lista, ou o valor será atribuido como nulo, ou undefined.
 , --prompt--; irá atribuir como valor o valor digitado pelo usuário. para utilizá-lo;
 , 
 , -message; será a mensagem mostrada ao usuario. ex: 'Quantas Vendas?'
 , -cancel; valor que poderá ser digitado pelo usuario, para cancelar o prompt, e a adição. (opcional)
 , 
 .. TAMBÉM PODEMOS CONFIGURAR OS VALORES, UTILIZANDO DA PROPRIEDADE 'config_value'. ESSA PROPRIEDADE IRÁ FICAR NO MESMO OBJETO DO VALOR CONFIGURADO,
 .. SENDO APLICADO APENAS NESSE VALOR CONFIGURADO. TEMOS ALGUMAS CONFIGURAÇÕES POSSÍVEIS, SENDO ELAS:
 , --default--; um valor padrão, caso o valor vazio, ou o usuario clique em cancel no prompt. default aceita um objeto com valores padrões complexos. são;
 , - default: { column } - 
 , -desc; o valor padrão se torna uma coluna específica do registro. 
 ,
 , --desconto--; será usado para aplicar um desconto percentual á o valor de outra coluna. ex;
 , - desconto: { column } -
 , -desc; o valor do desconto (percentual), é o valor da coluna que o chama, 
 , e o valor descontado será calculado a partir da coluna referenciada na propriedade desconto.
 , 
 .. UMA PROPRIEDADE DO 'config_value', É O 'verify'. ELE IRÁ VERIFICAR O VALOR ATRIBUIDO, LANÇANDO ERROS, E AVISANDO O USUARIO DO ERRO.
 .. TEMOS ALGUMAS CONFIGURAÇÕES POSSÍVEIS PARA 'config_value', SENDO ELAS:
 , --type--; a mesma lógica do 'type' documentada anteriormente, ex; caso o 'type' seja 'string' apenas string serão permitidas.
 ,
 , - 'int' - 
 , -desc; apenas aceitará valores números inteiros, propriedades á 'int':
 ,
 , -min; valor mínimo permitido
 , -max; valor máximo permitido.
 ,
 , --error_message--; mensagem de error, caso seja lançada um error pelo 'verify'. (opcional)
*/

//# Componentes //
import THead from './ListaTHEAD'
import TBody from './ListaTBODY'
//# Classes //
import './Lista.scss'

/*--------------*/
//# Exportações //

//.. Lista //
export default function Lista(
    {
        tHeadTh,
        tBodyTr,
        tBodyTd,
        actionDel,
        actionAlt,
        actionAdd,
        config_dados,
        Rota = ''
    }
) {

    //# Verificações //

    if (!Array.isArray(tBodyTd)) {
        console.error('Error Lista; TBODY Componente, tBodyTd Passado Não É Um Array')
        return
    }
    if (!Rota) {
        console.error('Error Lista; Rota Não Definida')
    }

    /*--------------*/
    return (
        <>
            <table className='table-lista'>
                <THead
                    tHeadTh={tHeadTh}
                />
                <TBody
                    tHeadTh={tHeadTh}
                    tBodyTr={tBodyTr}
                    tBodyTd={tBodyTd}
                    config_dados={config_dados}
                    actions={
                        {
                            actionDel:
                                actionDel ? {
                                    props: actionDel,
                                    rota: actionDel.Rota || Rota
                                } : undefined,
                            actionAlt:
                                actionAlt ? {
                                    props: actionAlt.props,
                                    rota: actionAlt.Rota || Rota
                                } : undefined,
                            actionAdd:
                                actionAdd ? {
                                    props: actionAdd,
                                    rota: actionAdd.Rota || Rota
                                } : undefined
                        }
                    }
                />
            </table>
        </>
    )
}

