/*
 .. Esse Contexto Está Ligado Á 'local_usr_cnfg' Um Arquivo Que Contém Funções Para Iniciar, Setar, Recuperar Dados
 .. Do Item 'user_config' Do Local Storage. Sem Esse Arquivo, Esse Contexto Não Irá Funcionar.
*/

//# Libs //
import { createContext, useState } from 'react'
//# Local Storage //
import local_usr_cnfg from '../local_storage/local_usr_cnfg'

const cntxt_usr_cnfg = createContext()
const { local_ini, set_local, get_local } = local_usr_cnfg()

export function Provider_usr_cnfg({ children }) {
    const [usr_cnfg, set_usr_cnfg] = useState(get_local())
    return (
        <cntxt_usr_cnfg.Provider value={{
            local_ini,
            set_usr_cnfg: (key, data) => {
                set_local(key, data)
                set_usr_cnfg({ ...usr_cnfg, [key]: data })
            },
            usr_cnfg
        }}>
            {children}
        </cntxt_usr_cnfg.Provider>
    )
}
export default cntxt_usr_cnfg