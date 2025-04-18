async function BuildWhere(query, clausule_key, clausule_value, error) {
    //.. Raw //
    if (clausule_key === 'whereRaw') {
        if (typeof clausule_value === 'function') {
            const { condition, values } = await clausule_value()
            query.whereRaw(condition, values)
        } else {
            error.msg = `clausule_value; '${clausule_value}' Inválido, Precisa ser uma 'function', pois o filter é 'whereRaw'.`
        }
        return
    }

    //.. Array //
    if (Array.isArray(clausule_value)) return query[clausule_key](...clausule_value)

    //.. Group //
    const group_main_keys = Object.keys(clausule_value)
    if (group_main_keys.length > 0) {
        function handle_group(builder, keys, values) {
            keys.forEach((key) => {
                const value = values[key]
                if (Array.isArray(value)) {
                    builder[key](...value)
                } else {
                    const secondary_keys = Object.keys(value)
                    builder[key]((sub_builder) => {
                        handle_group(sub_builder, secondary_keys, value)
                    })
                }
            })
        }
        query[clausule_key]((builder) => {
            handle_group(builder, group_main_keys, clausule_value)
        })
        return
    }
    error.msg = `clausule_value; '${clausule_value}' Inválido, Não Se Enquadra Em Nenhum.`
}

export default async function BuilderWhere(builder) {
    let error = {
        msg: undefined
    }

    const { query } = builder
    if (!query) {
        error.msg = 'A Query Não Existe, Valor Nulo, Vazio.'
    }

    if (!error.msg) {
        for (const field in builder) {
            if (field === 'query') continue

            const { condition, filter } = builder[field]

            if (condition) {
                for (const filter_value of filter) {
                    const clausule_key = Object.keys(filter_value)[0]
                    const clausule_value = filter_value[clausule_key]
                    await BuildWhere(query, clausule_key, clausule_value, error)
                    if (error.msg) break;
                }
            }

            if (error.msg) break;
        }
    }

    if (error.msg) {
        console.error(`;------- Error BuilderWhere -------; ${error.msg}`)
    }
}
