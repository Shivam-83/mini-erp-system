const { getCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = require('../models/customerModel');

async function list(req, res, next) {
  try {
    const customers = await getCustomers();
    res.json({ customers });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ customer });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const customer = await createCustomer(req.body);
    res.json({ customer });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const customer = await updateCustomer(id, req.body);
    res.json({ customer });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await deleteCustomer(id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
