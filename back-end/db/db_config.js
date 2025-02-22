import knex from 'knex'
import db_knex_file from './db_knex_file.js'

const db_gestaoprodutosvendas = knex(db_knex_file.dev);
/*--------------*/

export { db_gestaoprodutosvendas }