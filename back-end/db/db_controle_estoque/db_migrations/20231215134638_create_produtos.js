/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable("produtos", (table) => {
        //.. TABELA //
        table.increments('i_id_produtos')
        table.string("s_nome_produtos", 255).notNullable()
        table.string("s_fornecedor_produtos", 255).notNullable()
        table.decimal("f_valor_produtos").unsigned().notNullable()
        table.decimal("f_valorFornecedor_produtos").unsigned().notNullable()
        table.integer("i_estoque_produtos").unsigned().notNullable()
        table.string("s_img_produtos").notNullable().defaultTo('http://localhost:3000/produtos/imagens/server_imagem/no-image-icon.png')
        table.integer("i_desconto_produtos").unsigned().notNullable().defaultTo(0)

        //.. VERIFICAÇÕES //
        table.check('i_desconto_produtos <= 100');
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTable("produtos")
};
