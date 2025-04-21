//# Componentes //
import InputField from "../Componentes Globais/Inputs/InputField"
import MergedInputsField from '../Componentes Globais/Inputs/MergedInputsField'
import InputDate from "../Componentes Globais/Inputs/InputDate"
import InputBoolean from "../Componentes Globais/Inputs/InputBoolean"
import Btn from '../Componentes Globais/Inputs/Button'
import Alert from '../Componentes Globais/Div/divAlert'
import WebService from '../../config/config_websv'
import FieldSet from '../Componentes Globais/Miscellaneous/FieldSet'
import Txt from '../Componentes Globais/Miscellaneous/TxtPadrão'
//# Libs //
import InputsControl from "../../helpers/js/InputsControl"
import { useState } from "react"
import { PerformRequest } from 'performrequest'
//# Icons //
import { FaCashRegister } from 'react-icons/fa';
import { FaTruck } from 'react-icons/fa';
//# Helpers //
import { CurrentDate } from '../../helpers/js/CurrentDate';
//# Classes //
import './InputVendas.scss'
/*--------------*/

export default function InputsController() {

    //# InputsFields //
    const inputsFields = [
        {
            name: 's_nome_vendas',
            required: true,
            placeholder: "Exemplo",
            divInputClass: 'form-vendas__inputs-nomes',
            className: 'form-vendas__inputs',
            maxlength: 255,
            icon: <FaCashRegister />,
            autofocus: true,
        },
        {
            name: 's_fornecedor_vendas',
            required: true,
            placeholder: "Exemplo Fornecedor",
            divInputClass: 'form-vendas__inputs-nomes',
            className: 'form-vendas__inputs',
            icon: <FaTruck />,
            maxlength: 255,
        },
        {
            name: 'f_valorFornecedor_vendas',
            required: true,
            placeholder: "Fornecedor R$",
            step: 0.01
        },
        {
            name: 'f_valor_vendas',
            required: true,
            placeholder: "Lucro R$",
            step: 0.01
        },

        {
            name: 'i_quantidade_vendas',
            step: 1,
            width: 94.5,
            default_value: 1,
            placeholder: '1',
            center: true,
            className: 'form-vendas__inputs',
        },
        {
            name: 'd_data_vendas',
            default_value: CurrentDate(),
            className: 'form-vendas__inputs',
            required: true,
        },
        {
            name: 'i_desconto_vendas',
            step: 0.01,
            default_value: 0,
            placeholder: '12.05%',
            className: 'form-vendas__inputs',
            center: true,
            required: true
        },
    ]
    //# InputsControl //
    const { onSubmit, inputsController, onReset } = InputsControl({
        inputsFields: inputsFields,
        submitFunction: reqPost
    })

    /*--------------*/
    //# REQS //
    async function reqPost(data) {
        setResInfo({
            text: 'Enviado...',
            status: 'pending'
        })
        await PerformRequest({
            fetch: {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                url: `${WebService}/vendas`,
            },
            message: {
                success: `status.{'status'} - ID'S; {'res.info'}`,
                error: `status.{'status'} - {'res.info'}`,
            },
            function: {
                success: (res_json) => {
                    let ID = [res_json.info[0], res_json.info[data.i_quantidade_vendas - 1]]
                    const txtID = ID[0] === ID[1] ? `${ID[0]}` : `${ID[0]} - ${ID[1]}`
                    setResInfo({
                        text: `Cadastrado, Código Do Produto: ${txtID}`,
                        status: 'success'
                    });
                },
                error: (error) => {
                    setResInfo({
                        text: `${error.message}`,
                        status: 'fail'
                    });
                }
            },
        })
        setTimeout(() => setResInfo({
            text: '',
            status: ''
        }), 2500)
    }
    /*--------------*/
    //# Variáveis //

    const [resInfo, setResInfo] = useState({
        text: '',
        status: ''
    })

    /*--------------*/
    return (
        <>
            <InputVendas
                inputsController={inputsController}
                onSubmit={onSubmit}
                resInfo={resInfo}
                onReset={onReset}
            />
        </>
    )
}
function InputVendas({
    inputsController,
    onSubmit,
    onReset,
    resInfo
}) {
    return (
        <>
            <Txt type={'h1'} texto={'VENDAS'} title_2={true} className="main-inclusao__txt-vendas" />
            <form className='form-vendas' onSubmit={onSubmit}>
                {// .. Inputs (divInput) //
                }
                <div className="form-vendas__div-inputs">
                    {// .. fieldSet NOMES //
                    }
                    <FieldSet
                        legendTxt={'NOMES'}
                        className={'form-vendas__field-set-nomes'}
                        center={true}
                        JSX={
        
                            <>
                                <InputField
                                    type='text'
                                    id='s_nome_vendas'
                                    inputsController={inputsController}
                                />
                                <InputField
                                    type='text'
                                    id='s_fornecedor_vendas'
                                    inputsController={inputsController}
                                />
                            </>}
                    />
                    {// .. Div GAP-BETWEEN //
                    }
                    <div className="form-vendas__div-gap">
                        {// .. fieldSet DATA //
                        }
                        <FieldSet
                            legendTxt={'DATA'}
                            className={'form-vendas__field-set-data'}
                            JSX={
                                <>
                                    <InputBoolean
                                        inputsController={inputsController}
                                        message={'Data Específica?'}
                                        id={'d_data_vendas'}
                                        standard_value={''}
                                        margin={true}
                                        center={true}
                                        JSX={
                                            <>
                                                <InputDate
                                                    id='d_data_vendas'
                                                    inputsController={inputsController}
                                                />
                                            </>}
                                    />
                                </>
                            }
                        />
                        {// .. fieldSet DESCONTO //
                        }
                        <FieldSet
                            legendTxt={'DESCONTO'}
                            className={'form-vendas__field-set-desconto'}
                            JSX={
                                <>
                                    <InputBoolean
                                        inputsController={inputsController}
                                        id={'i_desconto_vendas'}
                                        message={'Adicionar Desconto?'}
                                        margin={true}
                                        center={true}
                                        JSX={
                                            <>
                                                <InputField
                                                    type='number'
                                                    id='i_desconto_vendas'
                                                    inputsController={inputsController}
                                                />
                                            </>
                                        }
                                    />
                                </>
                            }
                        />
                    </div>
                    {// .. Div GAP-BETWEEN //
                    }
                    <div className="form-vendas__div-gap">
                        {// .. fieldSet PREÇOS R$ //
                        }
                        <FieldSet
                            legendTxt={'PREÇO R$'}
                            className={'form-vendas__field-set-preco'}
                            center={true}
                            JSX={
                                <>
                                    <MergedInputsField
                                        type={['number', 'number']}
                                        id={['f_valor_vendas', 'f_valorFornecedor_vendas']}
                                        inputsController={inputsController}
                                    />
                                </>}
                        />
                        {// .. fieldSet QUANTIDADE VENDAS //
                        }
                        <FieldSet
                            legendTxt={'Quantidade Vendas'}
                            className={'form-vendas__field-set-quantidade'}
                            center={true}
                            JSX={
                                /* Inputs PREÇOS R$ */
                                <>
                                    <InputField
                                        type='number'
                                        id='i_quantidade_vendas'
                                        inputsController={inputsController}
                                    />
                                </>}
                        />
                    </div>
                    {// .. Btns //
                    }
                    <div className="form-vendas__div-btns">
                        <Btn
                            type={'submit'}
                            value={'Enviar'} />
                        <Btn
                            type={'reset'}
                            value={'Limpar'}
                            onClick={onReset}
                        />
                    </div>
                    {/*--------------*/}
                </div>
                {/*--------------*/}
            </form>
            {// .. Alert MSG //
            }
            <Alert
                text={resInfo.text}
                status={resInfo.status}
            />
            {/*--------------*/}
        </>
    )
}