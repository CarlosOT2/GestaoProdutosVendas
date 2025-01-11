/*
..   IRÁ FORMAR A DATA ATUAL NO FORMATO PADRÃO; Y0000M00D00
*/
export function CurrentDate() {
    const currentDate = new Date()
    let date = {
        year: String(currentDate.getFullYear()).padStart(4, '0'),
        month: String(currentDate.getMonth() + 1).padStart(2, '0'),
        day: String(currentDate.getDate()).padStart(2, '0')
    }
    return `Y${date.year}M${date.month}D${date.day}`
}