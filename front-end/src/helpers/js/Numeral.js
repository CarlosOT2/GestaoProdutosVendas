import numeral from 'numeral'

numeral.register('locale', 'pt-br', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'K',
        million: 'M',
        billion: 'B',
    },
    ordinal: function () {
        return 'º';
    },
    currency: {
        symbol: 'R$'
    }
});
numeral.locale('pt-br');

export default numeral;