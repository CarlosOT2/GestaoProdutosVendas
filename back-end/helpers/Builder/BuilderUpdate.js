export default async function BuilderUpdate(config_update) {
    let msgError;
    
    const query = config_update.query
    if (!query) {
        msgError = 'A Query Não Existe, Valor Nulo, Vazio.'
    }
    if(!msgError){
        for (const column in config_update) {
            if (column === 'query') continue
            
            const { condition, new_value } = config_update[column]
            if(condition){
                query.update({ [column]: new_value })
            }
        }
    }
    if (msgError) {
        console.error(`;------- Error BuilderUpdate -------; ${msgError}`)
    }
}