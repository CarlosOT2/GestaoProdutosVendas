/*
 .. Esse Local Storage Está Ligado Á 'cntxt_usr_cnfg' Um Arquivo Que Contém Um Contexto, E Provider Do Contexto.
 .. Ele Não Está Ligado Diretamente Á O Contexto, Porém, O Local Storage Poderá Ser Melhor Usado Com O Contexto.
*/

export default function local_usr_cnfg() {
    function get_local() {
        local_ini()
        return JSON.parse(localStorage.getItem('user_config'))
    }
    function local_ini() {
        const initial_config = { bg_theme: 'light_bg' }
        if (!localStorage.getItem('user_config')) {
            localStorage.setItem('user_config', JSON.stringify(initial_config))
        }
    }
    function set_local(key, data) {
        const current_data = JSON.parse(localStorage.getItem('user_config'))
        current_data[key] = data
        localStorage.setItem('user_config', JSON.stringify(current_data))
    }
    return ({ local_ini, set_local, get_local })
}