exports.up = async function(knex) {
  await knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name', 150).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('role', 50).defaultTo('user');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('projects', table => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.text('description');
    table.decimal('budget', 14, 2).defaultTo(0);
    table.decimal('spent', 14, 2).defaultTo(0);
    table.decimal('progress', 5, 2).defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('accounts', table => {
    table.increments('id').primary();
    table.string('name', 150).notNullable().unique();
    table.string('type', 50);
    table.decimal('balance', 18, 2).defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('invoices', table => {
    table.increments('id').primary();
    table.integer('project_id').unsigned().references('id').inTable('projects').onDelete('SET NULL');
    table.text('description');
    table.decimal('amount', 14, 2).notNullable();
    table.string('status', 50).defaultTo('pending');
    table.timestamp('issued_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('invoices');
  await knex.schema.dropTableIfExists('accounts');
  await knex.schema.dropTableIfExists('projects');
  await knex.schema.dropTableIfExists('users');
};
