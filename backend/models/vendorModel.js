const db = require('../db');

async function getVendors() {
  const [rows] = await db.execute('SELECT * FROM vendors ORDER BY name');
  return rows;
}

async function getVendorById(id) {
  const [rows] = await db.execute('SELECT * FROM vendors WHERE id = ?', [id]);
  return rows[0];
}

async function createVendor(data) {
  const { name, email, phone, address, city, country, tax_id, payment_terms } = data;
  const [result] = await db.execute(
    'INSERT INTO vendors (name, email, phone, address, city, country, tax_id, payment_terms) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, address, city, country, tax_id, payment_terms]
  );
  return { id: result.insertId, ...data };
}

async function updateVendor(id, data) {
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
  await db.execute(`UPDATE vendors SET ${fields.join(', ')} WHERE id = ?`, values);
  return getVendorById(id);
}

async function deleteVendor(id) {
  await db.execute('DELETE FROM vendors WHERE id = ?', [id]);
}

module.exports = { getVendors, getVendorById, createVendor, updateVendor, deleteVendor };
