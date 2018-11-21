const mongoose = require('mongoose');
const Store = mongoose.model('Store');

const userController = require('./userController');

exports.getAllStores = async () => {
  const stores = await Store.find();
  return stores;
};

exports.getStoreByUserID = async (id) => {
  const stores = await Store
    .find({ users: id });
  return stores;
};

// Middleware
exports.storesPage = async (req, res) => {
  const stores = await this.getAllStores();
  res.render('stores/all', { title: 'Stores', stores });
};

exports.addStorePage = async (req, res) => {
  const users = await userController.getUsers();
  res.render('stores/new', { title: 'Add New Store', users });
};

exports.addStore = async (req, res) => {
  const store = new Store(req.body);
  await store.save();
  req.flash('success', 'Store has been added successfully.');
  res.redirect('/stores');
};

exports.editStorePage = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  const users = await userController.getUsers();
  res.render('stores/edit', { title: 'Edit Store', store, users });
};
