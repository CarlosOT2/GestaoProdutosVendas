/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("vendas", (table) => {
        //.. TABELA //
        table.increments('i_id_vendas')
        table.string("s_nome_vendas", 255).notNullable()
        table.string("s_fornecedor_vendas", 255).notNullable()
        table.decimal("f_valorFornecedor_vendas").unsigned().notNullable()
        table.decimal("f_valor_vendas").unsigned().notNullable()
        table.date("d_data_vendas").notNullable()
        table.integer("i_desconto_vendas").unsigned().notNullable().defaultTo(0)

        //.. VERIFICAÇÕES //
        table.check('i_desconto_vendas <= 100');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("vendas")
};
