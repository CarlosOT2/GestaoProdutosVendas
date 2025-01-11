/*
                                                   # COMO FUNCIONA ?

..   IRÁ VERIRICAR AS VARIÁVEIS, CASO ALGUMA VARIÁVEL SEJA VAZIO, UNDEFINED, IRÁ RETORNAR TRUE, CASO CONTRÁRIO, IRÁ RETORNAR FALSE.

*/

export default function RequiredVariables(obj_var, res) {
    const nomes_variaveis = Object.keys(obj_var)
    for (let i = 0; i < nomes_variaveis.length; i++) {
        const nome_atual = nomes_variaveis[i]
        const valor_atual = obj_var[nome_atual]
        if (!valor_atual && valor_atual !== 0) {
            if (res) {
                res.status(400).json({ info: `REQ; O Campo '${nome_atual}' Está Faltando.` })
            } else {
                console.log(`;------- Error RequiredVariables -------; A Variável '${nome_atual}' Está Faltando.`)
            }
            return true
        }
    }
    return false
}


