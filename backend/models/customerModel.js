const db = require('../db');

async function getCustomers() {
  const [rows] = await db.execute('SELECT * FROM customers ORDER BY name');
  return rows;
}

async function getCustomerById(id) {
  const [rows] = await db.execute('SELECT * FROM customers WHERE id = ?', [id]);
  return rows[0];
}

async function createCustomer(data) {
  const { name, email, phone, address, city, country, tax_id, credit_limit } = data;
  const [result] = await db.execute(
    'INSERT INTO customers (name, email, phone, address, city, country, tax_id, credit_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, address, city, country, tax_id, credit_limit || 0]
  );
  return { id: result.insertId, ...data };
}

async function updateCustomer(id, data) {
  const fields = [];
  const values = [];
  
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  });
  
  if (fields.length === 0) return null;
  
  values.push(id);
  await db.execute(`UPDATE customers SET ${fields.join(', ')} WHERE id = ?`, values);
  return getCustomerById(id);
}

async function deleteCustomer(id) {
  await db.execute('DELETE FROM customers WHERE id = ?', [id]);
}

module.exports = { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
