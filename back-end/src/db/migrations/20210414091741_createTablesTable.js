exports.up = function (knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").primary();
    table.string("table_name");
    table.integer("capacity");
    table.boolean("occupied").defaultTo(false);
    table.integer("reservation_id");
    table.foreign("reservation_id").references("reservation_id").inTable("reservations");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};
