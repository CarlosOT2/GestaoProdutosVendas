//# Componentes //
import Lista from '../Componentes Globais/Lista/Lista'
//# Classes //
import './ListaProdutos.scss'
//# Helpers //
import { CurrentDate } from '../../helpers/js/CurrentDate';

//# Estrutura Lista //

//.. Th Head //
const tHeadTh_Produtos = [
    { innerText: 'Cód', id: 'thCod' },
    { innerText: 'Nome', className: 'tr-produtos__th-head' },
    { innerText: 'Fornecedor', className: 'tr-produtos__th-head' },
    { innerText: 'Preço R$', className: 'tr-produtos__th-head' },
    { innerText: 'Fornecedor R$', className: 'tr-produtos__th-head' },
    { innerText: 'Estoque', className: 'tr-produtos__th-head' },
    { innerText: 'Desconto', className: 'tr-produtos__th-head' },
    { innerText: 'IMG', className: 'tr-produtos__th-head' },
    { innerText: 'Ações', className: 'tr-produtos__th-head--acões' }
]
//.. Tr Body //
const tBodyTr_Produtos = {
    key: 'i_id_produtos'
}
//.. Td Body //
const tBodyTd_Produtos = [
    {
        column: 'i_id_produtos',
        className: 'tr-produtos__td-body',
        id: true
    },
    {
        column: 's_nome_produtos',
        className: 'tr-produtos__td-body',
        title: 'Alterar Nome'
    },
    {
        column: 's_fornecedor_produtos',
        className: 'tr-produtos__td-body',
        title: 'Alterar Fornecedor'
    },
    {
        column: 'f_valor_produtos',
        className: 'tr-produtos__td-body',
        title: 'Alterar Preço R$',
        desconto: 'i_desconto_produtos'
    },
    {
        column: 'f_valorFornecedor_produtos',
        className: 'tr-produtos__td-body',
        title: 'Alterar Fornecedor R$',
        cash: true
    },
    {
        column: 'i_estoque_produtos',
        className: 'tr-produtos__td-body',
        title: 'Alterar Quantidade',
        number: true
    },
    {
        column: 'i_desconto_produtos',
        className: 'tr-produtos__td-body',
        title: 'Alterar Desconto',
        percentage: true
    },
    {
        column: 's_img_produtos',
        img: true
    },
]

//# Exportações //

//.. Componente Lista //
export default function ListaProdutos({ config_dados }) {
    return (
        <Lista
            tHeadTh={tHeadTh_Produtos}
            tBodyTr={tBodyTr_Produtos}
            tBodyTd={tBodyTd_Produtos}
            config_dados={config_dados}
            Rota='produtos'
            actionDel={{
                title: 'Excluir Produtos',
                message: 'Tem Certeza? O Produto Não Poderá Ser Mais Consultado, Após Deleta-lo.'
            }}
            actionAdd={{
                Rota: 'vendas',
                title: 'Adicionar Vendas',
                type: {
                    name: 'sales',
                    rota: 'produtos',
                    column: { storage_value: 'i_estoque_produtos' },
                    data: { quantity_sales: 'i_quantidade_vendas' },
                    error_message: {
                        storage_value: 'Estoque Igual Á 0 Ou Menor; Impossível Adicionar Novas Vendas',
                        quantity_sales: 'Quantidade Vendas Inválida; Ultrapassou Estoque'
                    }
                },
                data: {
                    s_nome_vendas: { column: 's_nome_produtos' },
                    s_fornecedor_vendas: { column: 's_fornecedor_produtos' },
                    f_valor_vendas: { column: 'f_valor_produtos' },
                    f_valorFornecedor_vendas: { column: 'f_valorFornecedor_produtos' },
                    d_data_vendas: { value: CurrentDate() },
                    i_quantidade_vendas: {
                        prompt: { message: `Quantidade Específica? (Digite -1 Para Cancelar)`, cancel: '-1' },
                        config_value: {
                            default: 1,
                            verify: {
                                type: 'int',
                                max: 100,
                                min: 1,
                                error_message: 'Quantidade Inválida; Entre 1 á 100'
                            }
                        }
                    },
                    i_desconto_vendas: {
                        prompt: { message: `Desconto Específico? (Digite -1 Para Cancelar)`, cancel: '-1' },
                        config_value: {
                            desconto: 'f_valor_vendas',
                            default: { column: 'i_desconto_produtos' },
                            verify: {
                                type: 'int',
                                max: 100,
                                min: 0,
                                error_message: 'Desconto Inválido; Entre 0 á 100'
                            }
                        }
                    },
                }
            }}
            actionAlt={{
                props: [
                    { column: 's_nome_produtos', prompt: 'Digite o Novo Nome:', type: 'string' },
                    { column: 's_fornecedor_produtos', prompt: 'Digite O Novo Fornecedor:', type: 'string' },
                    { column: 'f_valor_produtos', prompt: 'Digite o Novo Preço:', type: 'cash' },
                    { column: 'f_valorFornecedor_produtos', prompt: 'Digite o Novo Preço De Fábrica:', type: 'cash' },
                    { column: 'i_estoque_produtos', prompt: 'Digite A Nova Quantidade De Produtos:', type: 'int' },
                    { column: 'i_desconto_produtos', prompt: 'Digite O Novo Desconto:', type: 'perc' },
                ]
            }}
        />
    )
}

//.. Estrutura Lista //
export function structure_ListaProdutos() {
    return ({
        tHeadTh_Produtos,
        tBodyTr_Produtos,
        tBodyTd_Produtos
    })
}
