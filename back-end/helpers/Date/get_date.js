//# Import //

import {
    format,
    startOfDay,
    startOfWeek,
    startOfMonth
} from 'date-fns'

//# Variáveis Globais //
const date_format = 'yyyy-MM-dd'

//# Funções Exportadas //

export function start(type) {
    const functions = {
        startOfDay,
        startOfWeek,
        startOfMonth
    }
    const current_date = new Date()
    const start = functions[type](current_date, type === 'startOfWeek' ? { weekStartsOn: 1 } : null)
    return (format(start, date_format))  
}

export function previous_date(time_object) {
    const current_date = new Date()
    let date_object = { current_date: format(current_date, date_format) }
    for (const time in time_object) {
        const previous_date = current_date.getTime() - time_object[time]
        date_object[time] = format(new Date(previous_date), date_format)
    }
    return date_object
}

export function current_date(specific_format = date_format) {
    const current_date = new Date()
    return format(current_date, specific_format)
}