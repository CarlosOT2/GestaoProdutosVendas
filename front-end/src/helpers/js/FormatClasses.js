/*
..          IRÁ FORMATAR UMA STRING DE CLASSES CONTENDO ESPAÇOS (OU QUALQUER STRING), EX:
, '  classe1    classe2  classe3    classe4 ' >> 'classe1 classe2 classe3 classe4'
*/
export function frmt(classes) {
    return classes.replace(/\s+/g, ' ').trim()
}
