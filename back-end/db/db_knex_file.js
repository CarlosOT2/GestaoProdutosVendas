/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
//# Import //
import get_root from './root_credentials.js'

//# Root //
const { username, password } = await get_root()

//# File //
const knex_file = {

  //.. db_controle_estoque //

  controle_estoque_dev: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: username,
      password: password,
      database: 'db_controle_estoque',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db_controle_estoque/db_migrations'
    },
    seeds: {
      directory: './db_controle_estoque/db_seeds'
    }
  },

  controle_estoque_stag: {
    client: 'mysql2',
    connection: {
      database: 'my_db',
      user: username,
      password: password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  controle_estoque_prod: {
    client: 'mysql2',
    connection: {
      database: 'my_db',
      user: username,
      password: password
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};

/*--------------*/

export default knex_file