/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('produtos').truncate();
  const seeds = Array.from({ length: 500 }, (_, index) => ({
    s_nome_produtos: `Produto ${index + 1}`,
    s_fornecedor_produtos: `Fornecedor ${index + 1}`,
    f_valor_produtos: Math.floor((Math.random() * (100 - 5) + 5) / 0.05) * 0.05,
    f_valorFornecedor_produtos: Math.floor((Math.random() * (20 - 5) + 5) / 0.05) * 0.05,
    i_estoque_produtos: Math.floor(Math.random() * 5),
  }));
  await knex('produtos').insert(seeds);
};
