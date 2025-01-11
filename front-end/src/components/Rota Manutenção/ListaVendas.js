//# Componentes //
import Lista from '../Componentes Globais/Lista/Lista'
//# Classes //
import './ListaVendas.scss'

//# Estrutura Lista //

//.. Th Head //
const tHeadTh_Vendas = [
    { innerText: 'Cód', id: 'thCod' },
    { innerText: 'Nome', className: 'tr-vendas__th-head' },
    { innerText: 'Fornecedor', className: 'tr-vendas__th-head' },
    { innerText: 'Preço R$', className: 'tr-vendas__th-head' },
    { innerText: 'Preço Fornecedor', className: 'tr-vendas__th-head' },
    { innerText: 'Data', className: 'tr-vendas__th-head' },
    { innerText: 'Desconto', className: 'tr-produtos__th-head' },
    { innerText: 'Ações', className: 'tr-vendas__th-head--acões' }
]
//.. Tr Body //
const tBodyTr_Vendas = {
    key: 'i_id_vendas'
}
//.. Td Body //
const tBodyTd_Vendas = [
    {
        column: 'i_id_vendas',
        className: 'tr-vendas__td-body',
        id: true
    },
    {
        column: 's_nome_vendas',
        className: 'tr-vendas__td-body',
    },
    {
        column: 's_fornecedor_vendas',
        className: 'tr-vendas__td-body',
    },
    {
        column: 'f_valor_vendas',
        className: 'tr-vendas__td-body',
        cash: true
    },
    {
        column: 'f_valorFornecedor_vendas',
        className: 'tr-vendas__td-body',
        cash: true
    },
    {
        column: 'd_data_vendas',
        className: 'tr-vendas__td-body tr-vendas__td-body-data',
        date: true
    },
    {
        column: 'i_desconto_vendas',
        className: 'tr-vendas__td-body',
        percentage: true
    },
]

//# Exportações //

//.. Componente Lista //
export default function ListaVendas({ config_dados }) {
    return (
        <Lista
            tHeadTh={tHeadTh_Vendas}
            tBodyTr={tBodyTr_Vendas}
            tBodyTd={tBodyTd_Vendas}
            config_dados={config_dados}
            actionDel={{
                title: 'Excluir Vendas',
                message: 'Tem Certeza? A Venda Não Poderá Ser Mais Consultada, Após Deleta-la.'
            }}
            Rota='vendas'
        />
    )
}

//.. Estrutura Lista //
export function structure_ListaVendas() {
    return ({
        tHeadTh_Vendas,
        tBodyTr_Vendas,
        tBodyTd_Vendas
    })
}
