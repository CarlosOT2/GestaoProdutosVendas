# BuilderWhere #

<h3> Utilização </h3>
Usado para construir queries where para o banco de dados

<h3> Como Usar </h3>
A construção da query usará de objetos e arrays. um laço de repetição é usado para percorrer cada array, objeto, 
<br/>
o resultado disso seria que a construção da query estaria em ordem cronológica.
<br/>
<br/>

para começar a construir a query, o primeiro passo seria passar a query para a função. ex;
```javascript
await BuilderWhere({
    query: query
})
```
após isso podemos começar a construir a query. vamos criar uma query bem básica, só para temos como exemplo.
```javascript
await BuilderWhere({
    query: query,
    s_nome_produtos: {
      condition: s_nome_produtos,
      filter: [
          { where: ['s_nome_produtos', "like", `%${s_nome_produtos}%`] }
      ]
    }
})
```
cada query possui um nome para identificá-lo (s_nome_produtos), por esse motivo não pode ser um nome repetido. 
<br/>
a propriedade condition é usada como uma verificação antes de aplicar a query; se a condição for falsa, a query não será aplicada.
<br/>
a propriedade filter construirá a query. ele recebe um array de objetos, cada objeto contendo uma condição para a query. 
<br/>
as nomenclaturas para a condição (where, andWhere, whereRaw, etc...) são as mesmas que aquelas em <b>knex</b>, então toda nomenclatura que têm no knex é usado aqui.
<br/>
<br/>
o valor do objeto pode ser um array ou outro objeto. se for um array, seria uma <b>query simples</b>
<br/>
se for um objeto, seria uma <b>query com parênteses</b>, que seria uma query com parênteses no MySQL puro.

```javascript
filter: [
     { where: ['Exemplo', 'like', `%Exemplo%`] },
     { where: ['Exemplo2', 'like', `%Exemplo2%`] },
     { where: ['Exemplo3', 'like', `%Exemplo3%`] }
]
```
```javascript
filter: [
  {
        where: {
            where: ['Exemplo', '>', Number(Exemplo) - 1],
            andWhere: ['Exemplo', '<', Number(Exemplo) + 1],
            orWhere: {
                where: ['Exemplo2', '>', Number(Exemplo2) - 1],
                andWhere: ['Exemplo2', '<', Number(Exemplo2) + 1],
            }
        }
  },
]
```
podemos observar que é o array que constrói a query, sendo usado um padrão obrigatório para todos os arrays. 
```javascript
/*
1º item será a coluna
2º item será o operador
3º item será o valor
*/

filter: [
     { where: ['coluna', 'operador', 'valor'] }
]
```
existe uma nomenclatura especial para a criação da query, o <b>whereRaw</b>. ele apenas aceita funções que retorna um objeto 
<br/>
contendo as propriedades <b>condition</b> e <b>values</b>. sendo semelhante ao whereRaw usado no knex.
<br/>
<br/>
<b>condition</b>: é a condição utilizada. ex; 'YEAR(d_data_vendas) = ?'
<br/>
<b>values</b>: é os valores da condição, que é substituído pela '?' na condição. ex; [ 12 ]
