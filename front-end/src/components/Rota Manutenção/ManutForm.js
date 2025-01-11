//# Componentes //
import Btn from '../Componentes Globais/Inputs/Button'
import InputField from '../Componentes Globais/Inputs/InputField'
import InputDate from '../Componentes Globais/Inputs/InputDate'
//# Libs //
import InputsControl from "../../helpers/js/InputsControl"
import qs from 'qs'
//# Classes //
import './ManutForm.scss'
/*--------------*/
export default function InputsController({ Lista, setUrl }) {

    //# InputsFields //
    //.. Produtos //
    const inputsProdutos = [{

        name: 'i_estoque_produtos',
        className: 'input-pequeno--num',
        placeholder: 'Estoque',
        step: 1
    },
    {
        name: 'f_valor_produtos',
        className: 'input-pequeno--num',
        placeholder: 'Preço R$',
        step: 0.05
    },
    {
        name: 's_fornecedor_produtos',
        className: 'input-pequeno',
        placeholder: 'Fornecedor',
        maxlength: 255
    },
    {
        name: 's_nome_produtos',
        className: 'input-pequeno',
        placeholder: 'Nome',
        maxlength: 255
    }]
    //.. Vendas //
    const inputsVendas = [{
        name: 'd_data_vendas',
        className: 'input-pequeno--date'
    },
    {
        name: 'f_valor_vendas',
        placeholder: 'Preço R$',
        step: 0.05,
        className: 'input-pequeno--num'
    },
    {
        name: 's_fornecedor_vendas',
        placeholder: 'Fornecedor',
        className: 'input-pequeno',
        maxlength: 255
    },
    {
        name: 's_nome_vendas',
        placeholder: 'Nome',
        className: 'input-pequeno',
        maxlength: 255
    }]

    /*--------------*/
    //# InputsControl //

    const { onSubmit, inputsController } = InputsControl(
        {
            inputsFields:
            Lista === 'produtos'
                    ?
                    inputsProdutos
                    :
                    Lista === 'vendas'
                        ?
                        inputsVendas
                        :
                        undefined,
            submitFunction: (inputsData) => { 
                const query = qs.stringify(inputsData)
                setUrl(prevState => ({
                    ...prevState,
                    end_point: {
                        ...prevState.end_point,
                        query: query
                    }
                }))
            },
            submitArguments: [Lista]
        }
    )
    /*--------------*/

    return (
        <>
            <ManutForm
                inputsController={inputsController}
                onSubmit={onSubmit}
                Lista={Lista}
            />
        </>
    )
}
function ManutForm(
    {
        Lista,
        onSubmit,
        inputsController,
    }
) {
    return (
        <>

            <form onSubmit={onSubmit}>
                <div className='div-inputs'>
                    {
                        //# PRODUTOS //
                        Lista === 'produtos' ?
                            <>
                                {
                                    //.. Inputs //
                                }
                                <InputField
                                    type='number'
                                    id='i_estoque_produtos'
                                    inputsController={inputsController}
                                />
                                <InputField
                                    type='number'
                                    id='f_valor_produtos'
                                    inputsController={inputsController}
                                />
                                <InputField
                                    type='text'
                                    id='s_fornecedor_produtos'
                                    inputsController={inputsController}
                                />
                                <InputField
                                    type='text'
                                    id='s_nome_produtos'
                                    inputsController={inputsController}
                                />
                                {
                                    //.. Btns //
                                }
                                <Btn type='submit' className='div-inputs__button' value='Pesquisar' />
                            </>
                            //# VENDAS //
                            : Lista === 'vendas' ?
                                <>
                                    {
                                        //.. Inputs //
                                    }
                                    <InputDate
                                        id='d_data_vendas'
                                        inputsController={inputsController}
                                    />
                                    <InputField
                                        type='number'
                                        id='f_valor_vendas'
                                        inputsController={inputsController}
                                    />
                                    <InputField
                                        type='text'
                                        id='s_fornecedor_vendas'
                                        inputsController={inputsController}
                                    />
                                    <InputField
                                        type='text'
                                        id='s_nome_vendas'
                                        inputsController={inputsController}
                                    />
                                    {
                                        //.. Btns //
                                    }
                                    <Btn type='submit' className='div-inputs__button' value='Pesquisar' />
                                </>
                                /*--------------*/ 
                                :
                                <></>
                        /*--------------*/
                    }
                </div>
            </form>
        </>
    )
}