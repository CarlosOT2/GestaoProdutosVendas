import knex from 'knex'
import db_knex_file from './db_knex_file.js'

const db_controle_estoque = knex(db_knex_file.db_gestaoprodutosvendas_dev);
/*--------------*/

export { db_controle_estoque }