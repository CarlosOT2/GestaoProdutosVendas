/*
..          IRÁ FORMATAR DATAS COMO '2024-12-12', '2024/12/12', '2024.12.12', PARA O FORMATO PADRÃO 'Y0000M00D00'
*/

export function FormatDate(date) {
    const date_numbers = date.replace(/\D/g, '');
    const filter_date =
        [
            date_numbers.slice(0, 4),
            date_numbers.slice(4, 6),
            date_numbers.slice(6, 8)
        ]
            .filter(Boolean)
    return filter_date.reduce((new_date, value, i) => {
        if (value) {
            if (i === 0) new_date += `Y${value.padStart(4, '0')}`
            if (i === 1) new_date += `M${value.padStart(2, '0')}`
            if (i === 2) new_date += `D${value.padStart(2, '0')}`
        }
        return new_date
    }, '')
}
