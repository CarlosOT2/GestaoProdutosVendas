//# Componentes //
import InputField from "../Componentes Globais/Inputs/InputField"
import MergedInputsField from '../Componentes Globais/Inputs/MergedInputsField'
import InputFile from "../Componentes Globais/Inputs/InputFile"
import Btn from '../Componentes Globais/Inputs/Button'
import Txt from '../Componentes Globais/Miscellaneous/TxtPadrão'
import WebService from '../../config/config_websv'
import Alert from '../Componentes Globais/Div/divAlert'
import FieldSet from '../Componentes Globais/Miscellaneous/FieldSet'
import InputBoolean from "../Componentes Globais/Inputs/InputBoolean"
//# Libs //
import { useState } from 'react'
import InputsControl from "../../helpers/js/InputsControl"
//# Icons //
import { FaBoxes } from 'react-icons/fa';
import { FaTruck } from 'react-icons/fa';
//# Classes //
import "./InputProdutos.scss"
//# Helpers //
import { PerformRequest } from '../../helpers/js/PerformRequest'
/*--------------*/

export default function InputsController() {

  //# InputsFields //

  const inputsFields = [
    {
      name: 's_nome_produtos',
      required: true,
      placeholder: "Exemplo",
      autofocus: true,
      divInputClass: 'form-produtos__inputs-nomes',
      className: 'form-produtos__inputs',
      maxlength: 255,
      icon: <FaBoxes />,
    },
    {
      name: 's_fornecedor_produtos',
      placeholder: 'Exemplo Fornecedor',
      required: true,
      divInputClass: 'form-produtos__inputs-nomes',
      className: 'form-produtos__inputs',
      maxlength: 255,
      icon: <FaTruck />,
    },
    {
      name: 'f_valor_produtos',
      required: true,
      placeholder: 'Produto R$',
      step: 0.01,
    },
    {
      name: 'f_valorFornecedor_produtos',
      required: true,
      placeholder: 'Fornecedor R$',
      step: 0.01,
    },
    {
      name: 'i_estoque_produtos',
      required: true,
      placeholder: '12...',
      className: 'form-produtos__inputs',
      center: true,
      step: 1,
    },
    {
      name: 'i_desconto_produtos',
      step: 0.01,
      default_value: 0,
      placeholder: '12.05%',
      className: 'form-produtos__inputs',
      center: true,
      required: true
    },
    {
      name: 's_img_produtos',
    },

  ]
  //# InputsControl //
  const { onSubmit, inputsController, onReset } = InputsControl({
    inputsFields: inputsFields,
    submitFunction: reqPost
  })

  /*--------------*/
  //# Variáveis //

  const [resInfo, setResInfo] = useState({
    text: '',
    status: ''
  })

  /*--------------*/
  //# REQS //

  async function reqPost(data) {
    setResInfo({
      text: 'Enviado...',
      status: 'pending'
    })
    // .. REQ //

    //, IMAGE //
    let dataImage = {
      file: data.s_img_produtos,
      response: undefined,
      imgPATH: undefined,
    }
    let radioIMG = data['radio-s_img_produtos'] === 'true'

    if (radioIMG) {
      //- Form-Data //
      const formData = new FormData()
      formData.append(`s_img_produtos`, data.s_img_produtos)

      dataImage.response = await PerformRequest({
        fetch: {
          url: `${WebService}/produtos/upload`,
          method: 'POST',
          body: formData
        },
        message: {
          error: `status.{'status'} - {'res.info'}`
        },
        function: {
          success: async (res_json) => {
            data.s_img_produtos = res_json.info
          },
          error: async (error) => {
            setResInfo({
              text: `${error.message}`,
              status: 'fail'
            });
          }
        },
        return: 'res'
      })
    }
    if ((radioIMG && dataImage.response.ok === true) || !radioIMG) {
      await PerformRequest({
        fetch: {
          url: `${WebService}/produtos`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
        message: {
          success: `status.{'status'} - {'res.info'}`,
          error: `status.{'status'} - {'res.info'}`,
        },
        function: {
          success: async (res_json) => {
            setResInfo({
              text: `Cadastrado, Código Do Produto: ${res_json.info}`,
              status: 'success'
            });
          },
          error: async (error) => {
            setResInfo({
              text: `${error.message}`,
              status: 'fail'
            });
          },
          finally: async () => {
            if (radioIMG) {
              data.s_img_produtos = dataImage.file
            }
          }
        }
      })
    }
    setTimeout(() => setResInfo({
      text: '',
      status: ''
    }), 2500)
  }
  /*--------------*/
  return (
    <>
      <InputProdutos
        inputsController={inputsController}
        onSubmit={onSubmit}
        onReset={onReset}
        resInfo={resInfo}
      />
    </>
  )
}

function InputProdutos({
  inputsController,
  onSubmit,
  onReset,
  resInfo
}) {
  return (
    <>
      <Txt type={'h1'} texto={'PRODUTOS'} title_2={true} className="main-inclusao__txt-produtos" />
      <form className='form-produtos' onSubmit={onSubmit}>
        {// .. Inputs (divInput) //
        }
        <div className="form-produtos__div-inputs">
          {// .. FieldSet NOMES //
          }
          <FieldSet
            className={'form-produtos__field-set-nomes'}
            legendTxt={'NOMES'}
            center={true}
            JSX={
              <>
                <InputField
                  type="text"
                  id="s_nome_produtos"
                  inputsController={inputsController}
                />
                <InputField
                  type="text"
                  id="s_fornecedor_produtos"
                  inputsController={inputsController}
                />
              </>}
          />
          {// .. Div GAP-BETWEEN //
          }
          <div className="form-produtos__div-gap">
            {// .. FieldSet IMG //
            }
            <FieldSet
              className={'form-produtos__field-set-img'}
              legendTxt={'IMG'}
              JSX={
                <>
                  <InputBoolean
                    inputsController={inputsController}
                    id={'s_img_produtos'}
                    message={'Anexar IMG?'}
                    margin={true}
                    JSX={
                      <>
                        <InputFile
                          id="s_img_produtos"
                          center={true}
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
              className={'form-produtos__field-set-desconto'}
              JSX={
                <>
                  <InputBoolean
                    inputsController={inputsController}
                    id={'i_desconto_produtos'}
                    message={'Adicionar Desconto?'}
                    margin={true}
                    center={true}
                    JSX={
                      <>
                        <InputField
                          type='number'
                          id='i_desconto_produtos'
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
          <div className="form-produtos__div-gap">
            {// .. FieldSet PREÇO R$ //
            }
            <FieldSet
              className={'form-produtos__field-set-preco'}
              legendTxt={'PREÇO R$'}
              center={true}
              JSX={
                <>
                  <MergedInputsField
                    type={['number', 'number']}
                    id={['f_valor_produtos', 'f_valorFornecedor_produtos']}
                    inputsController={inputsController}
                  />
                </>
              }
            />
            {// .. FieldSet ESTOQUE //
            }
            <FieldSet
              className={'form-produtos__field-set-estoque'}
              center={true}
              legendTxt={'ESTOQUE'}
              JSX={
                <>
                  <InputField
                    type="number"
                    id="i_estoque_produtos"
                    inputsController={inputsController}
                  />
                </>
              }
            />
          </div>
          {/*--------------*/}
          {// .. Btns //
          }
          <div className='form-produtos__div-btns'>
            <Btn
              type="submit"
              value="Enviar" />
            <Btn
              type="reset"
              value="Limpar"
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
  );
}