exports.up = function(knex) {
  return knex.schema.createTable("products", t => {
    t.increments("id").primary();
    t.string("productname");
    t.string("category");
    t.string("size");
    t.float("price");
    t.integer("bars_id").references("bars.id");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("products");
};
