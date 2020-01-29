exports.up = function(knex) {
  return knex.schema.createTable("bars", t => {
    t.increments("id").primary();
    t.string("barname");
    t.integer("users_id").references("users.id");
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("bars");
};
