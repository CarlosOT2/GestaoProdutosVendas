# BuilderWhere #

<h3> Usage </h3>
Used to build WHERE queries for the database

<h3> How to use </h3>
The query will be built using objects and arrays. A loop is used to iterate through each array and object.
<br/>
as a result, the query will be built in chronological order.
<br/>
<br/>

to start building the query, first step would be to pass the query to the function. example;
```javascript
await BuilderWhere({
    query: query
})
```
after that, we can start building the query. let's create a basic query, just to have an example.
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
each query has a name to identify it (e.g., s_nome_produtos), so it cannot be a redundant name.
<br/>
the condition property is used as a verification before running the query; if condition is false, query will not run.
<br/>
the filter property will build the query. it receives an objects array, with each object containing a condition for the query.
<br/>
the nomenclature for the query methods (where, andWhere, whereRaw, etc.) is the same as in <b>knex</b>, so all query methods available in Knex are used here.
<br/>
<br/>
the query condition value can be either an array or another object. if it is an array, it'll be a <b>simple query</b>.
<br/>
if it is an object, it'll be a <b>query with parentheses</b>, which would be the same as a query with parentheses in pure SQL.

```javascript
filter: [
     { where: ['Example', 'like', `%Example%`] },
     { where: ['Example2', 'like', `%Example2%`] },
     { where: ['Example3', 'like', `%Example3%`] }
]
```
```javascript
filter: [
  {
        where: {
            where: ['Example', '>', Number(Example) - 1],
            andWhere: ['Example', '<', Number(Example) + 1],
            orWhere: {
                where: ['Example2', '>', Number(Example2) - 1],
                andWhere: ['Example2', '<', Number(Example2) + 1],
            }
        }
  },
]
```
we can see that it's the array that builds the query, using a mandatory pattern for all arrays.

```javascript
/*
1º item will be the column
2º item will be the operator
3º item will be the value
*/

filter: [
     { where: ['column', 'operator', 'value'] }
]
```
there's a special nomenclature for creating the query, which's <b>whereRaw</b>. it only accepts functions that return an object 
<br/>
containing the properties <b>condition</b> and <b>values</b>, similar to common whereRaw used in knex.
<br/>
<br/>

<b>condition</b>: is the condition used. for example; 'YEAR(d_data_vendas) = ?'
<br/>
<b>values</b>: are the values for condition, which are substituted by '?' in condition. for example; [ 12 ]

