const { getVendors, getVendorById, createVendor, updateVendor, deleteVendor } = require('../models/vendorModel');

async function list(req, res, next) {
  try {
    const vendors = await getVendors();
    res.json({ vendors });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const vendor = await getVendorById(id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.json({ vendor });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const vendor = await createVendor(req.body);
    res.json({ vendor });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const vendor = await updateVendor(id, req.body);
    res.json({ vendor });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    await deleteVendor(id);
    res.json({ message: 'Vendor deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, getById, create, update, remove };
