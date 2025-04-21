//# Libs //
import { useState } from 'react'
import { PerformRequest } from 'performrequest'
//# Config //
import WebService from '../../config/config_websv.js'

//# Exportações // 
export default function PaginationControl(config_pagination) {
    const { req_function, obj_data, id_column } = config_pagination
    const [visible, setVisible] = useState(true)

    async function req_pagination(raw_url, cursor) {
        //.. Variáveis //
        const { success, error } = req_function ?? {}
        const { data, setData } = obj_data
        const config_url = {
            cursor: data.length !== 0 ? data[data.length - 1][id_column] : 0,
            url: `${WebService}/${raw_url}`
        }

        if (raw_url.includes('?')) {
            const url_split = raw_url.split('?')
            config_url.url = `${WebService}/${url_split[0]}?${url_split[1]}${cursor ? `&cursor=${config_url.cursor}` : ''}`
        } else if (cursor) {
            config_url.url += `?cursor=${config_url.cursor}`
        }

        await PerformRequest({
            fetch: {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                url: config_url.url,
            },
            message: {
                error: `status.{'status'} - {'res.info'}`
            },
            function: {
                success: async (res_json) => {
                    if (res_json.length === 0) {
                        setVisible(false)
                        if (cursor) {
                            return
                        }
                    } else {
                        setVisible(true)
                    }
                    setData(config_url.url.includes('?') && !cursor || !cursor ? [...res_json] : [...data, ...res_json]);
                    success?.(res_json);
                },
                error: async (err) => {
                    console.error(`;------- Error PaginationControl -------;`, err)
                    error?.(err);
                },
            },
        })
    }
    return (
        {
            req_pagination,
            setVisible,
            visible,
        }
    )
}