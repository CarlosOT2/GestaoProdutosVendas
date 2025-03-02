/*
                                                   # COMO FUNCIONA ?

..   IRÁ VERIRICAR AS VARIÁVEIS, CASO ALGUMA VARIÁVEL SEJA VAZIO, UNDEFINED, IRÁ RETORNAR TRUE, CASO CONTRÁRIO, IRÁ RETORNAR FALSE.

*/
//# Import //
import HTTPError from './Classes/HTTPError.js'

export default async function RequiredVariables(obj_var, options = {}) {
    const { return_boolean } = options
    const nomes_variaveis = Object.keys(obj_var)

    for (let i = 0; i < nomes_variaveis.length; i++) {
        const nome_atual = nomes_variaveis[i]
        const valor_atual = obj_var[nome_atual]

        const condition = !valor_atual && valor_atual !== 0
        if (condition) {
            if (return_boolean) return condition
            throw new HTTPError(`O Campo '${nome_atual}' Está Faltando.`, 400)
        }
    }
}


