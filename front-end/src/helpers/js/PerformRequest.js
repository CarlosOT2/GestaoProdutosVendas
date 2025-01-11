/*
                                  # COMO FUNCIONA ?

..          IRÁ REALIZAR UMA REQUEST Á UM SERVIDOR, RECEBENDO UM OBJETO 
..          CONTENDO TODOS OS DADOS NECESSITADOS PARA REALIZAR A REQUEST
..          EXEMPLO DO OBJETO RECEBIDO PELO ESSE HELPER;
, 
, {
,    fetch: {
,       method: 'PUT',
,       headers: { 'Content-Type': 'application/json' },
,       body: JSON.stringify(data),
,       url: `${WebService}/${actionAlt.rota}/${cod}`,
,    },
,    message: {
,       success: `status.{'status'} - {'res.info'}`,
,       error: `status.{'status'} - {'res.info'}`,
,       alert_error: true,
,       alert_success: true
,    },
,    function: {
,       success: async (res_json) => { 
,           setRegistros(responseData)
,           setAlert({ text: ``, status: 'success' });
,       },
,       error: async (error) => {
,           setAlert({ text: `${error}`, status: 'fail' });
,       },
,       finally: async () => {
,           if (IMG) {
,            data.s_img_produtos = dataImage.file
,           }
,       }
,    },
,    return: 'res.ok'
, }
- -fetch-:
..
.. ONDE IRÁ O CONTER AS OPÇÕES DO FETCH AO SERVIDOR, OPÇÕES DISPONÍVEIS:
,  
,  --method--; Method Da Request (Metodo)
,  --headers--; Header Da Request (Opções Gerais)
,  --body--; Body Da Request (Dados / Data)
,  --url--; Url Da Request (Rota Que Será Enviada A Request)
,
- -message-:
..
.. ONDE IRÁ CONTER AS MENSAGENS QUE SERÃO EXIBIDAS AO FINAL DA REQUEST, MENSAGENS DE ERROR E DE SUCESSO DA REQUISIÇÃO:
,
, --success--; Mensagem Exibida Quando A Requisição For Bem Sucedida 
, --error--; Mensagem Exibida Quando A Requisição For Mal Sucedida 
, --alert_error--; Irá Exibir O Texto Contido Em 'error', Com Alert(). (true/false)
, --alert_success--; Irá Exibir O Texto Contido Em 'success', Com Alert(). (true/false)
,
.. VOCÊ PODE COLOCAR VALORES ESPECIAIS NA MENSAGEM, COMO A RESPOSTA DA REQUISIÇÃO E STATUS, VALORES ESPECIAIS DISPONÍVEIS:
,
, --{'status'}--; Status Response Da Request (res.status)
, --{'res.info'}--; Informações Da Response (resJson.info)
,
- -function-:
..
.. FUNÇÕES QUE IRÃO SER EXECUTADAS, CASO A REQUEST SEJA SUCEDIDA, OU NÃO SEJA SUCEDIDA, TUDO IRÁ DEPENDER DO CÓDIGO DA RESPONSE.
.. ESSAS FUNÇÕES PODERÃO RECEBER DIVERSOS ARGUMENTOS, E SERÃO EXECUTADAS NÃO SEJA SUCEDIDO A REQUEST OU SEJA, OU SERÁ EXECUTADA INDEPENDENTE DA REQUEST, SÃO:
,
, --success--; Será executado caso a request seja bem sucedida, receberá o argumento res_json. (status; entre 200 á 299)
, --error--; Será executado caso a request não seja bem sucedida, receberá o argumento Error, do catch. (status; que não é entre 200 á 299)
, --finally--; Será executado independente do resultado da request, sempre será executada no final do bloco try... catch.., não receberá nenhum argumento. 
,
- -return-:
..
.. ONDE IRÁ INFORMAR O VALOR QUE SERÁ RETORNADO, POR 'await PerformRequest'. VALORES DISPONÍVEIS:
,
, --'res.ok'--; Irá retornar o valor 'ok' do objeto 'res'. (true/false)
, --'res_json'--; Irá retornar a res formatada para obj js. (OBJ)
, --'res'--; Irá retornar a res. (OBJ)
,
*/

async function formatMessage(reqMsg, res, res_json) {
    const formattedMessage = { ...reqMsg }
    for (let key in formattedMessage) {
        if (typeof (formattedMessage[key]) === 'string') {
            formattedMessage[key] = formattedMessage[key].replace(/{'status'}/, res.status)
            formattedMessage[key] = formattedMessage[key].replace(/{'res.info'}/, res_json.info)
        }
    }
    return formattedMessage
}

async function handleReturn(req, reqMsg, res, res_json) {
    const formatted_msg = await formatMessage(reqMsg, res, res_json)
    return new Promise((resolve, reject) => {

        let returnedValue;
        if (req.return === 'res.ok') {
            returnedValue = res.ok
        }
        if (req.return === 'res_json') {
            returnedValue = res_json
        }
        if (req.return === 'res') {
            returnedValue = res
        }
        if (res.ok && res.status >= 200 && res.status <= 299) {
            if (formatted_msg.success) {
                console.log(formatted_msg.success)

                if (reqMsg.alert_success) {
                    alert(formatted_msg.success)
                }
            }
            resolve(returnedValue)
        } else {
            reject({
                object: new Error(formatted_msg.error),
                returnedValue: returnedValue
            })
        }
    })
}

export async function PerformRequest(req) {
    const reqFetch = req.fetch
    const reqMsg = req.message
    const reqFunction = {
        success: req.function?.success || function () { },
        error: req.function?.error || function () { },
        finally: req.function?.finally || function () { }
    }

    try {
        const options = {
            method: reqFetch.method || 'GET',
            headers: reqFetch.headers || {},
            body: reqFetch.body || null
        }

        const res = await fetch(reqFetch.url, options)
        const res_json = await res.json()

        const return_value = await handleReturn(req, reqMsg, res, res_json)
        
        await reqFunction.success(res_json)
        return return_value
    } catch (error) {
        const error_obj = error.object || error
        await reqFunction.error(error_obj)

        console.error(error_obj)
        if (reqMsg.alert_error) {
            alert(error_obj.message)
        }
        return error.returnedValue
    } finally {
        await reqFunction.finally()
    }
}
