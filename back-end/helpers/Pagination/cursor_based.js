/*
                                                   # COMO FUNCIONA ?

..                   A Paginação Baseada Em Cursor Utiliza Um 'cursor' Como Referência Para Navegar.
..              O Cursor Armazena a Posição Do Último ID Da Lista, E Busca Todos Os Items Após Esse Id. 

*/

//# Import //
import BuilderWhere from '../Builder/BuilderWhere.js'

//# Funções Exportadas //
export async function BuildPagCursor(query, config_cursor) {
    try {
        const { cursor, column } = config_cursor
        if (cursor && query) {
            await BuilderWhere({
                query: query,
                [column]: {
                    condition: cursor,
                    filter: [{ where: [column, '>', cursor] }]
                }
            })
        }
    } catch (error) {
        throw new Error(error)
    }

}