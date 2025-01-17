/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

const getRandomDate = () => {
  const start = new Date('01-01-2019');
  const end = new Date('09-29-2024');
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString().split('T')[0]
};

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('vendas').truncate();
  const seeds = Array.from({ length: 2500 }, (_, index) => ({
    s_nome_vendas: `Vendas ${index + 1}`,
    s_fornecedor_vendas: `Fornecedor ${index + 1}`,
    f_valorFornecedor_vendas: Math.floor((Math.random() * (20 - 5) + 5) / 0.05) * 0.05,
    f_valor_vendas: Math.floor((Math.random() * (250 - 5) + 5) / 0.05) * 0.05,
    d_data_vendas: getRandomDate()
  }));
  
  await knex('vendas').insert(seeds);
};
