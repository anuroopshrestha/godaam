const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Store = mongoose.model('Store');

const userController = require('./userController');

exports.productsPage = async (req, res) => {
  const stores = await Store.find();
  // res.json(stores);
  res.render('products/all', {title: 'Products'});
};

exports.addProductPage = async (req, res) => {
  const users = await userController.getUsers();
  res.render('products/new', {title: 'Add New Product', users});
};

exports.addProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  req.flash('info', 'New product has been added!');
  res.redirect('/products');
  req.flash('error', 'An unexpected error has occured.');
  res.redirect('/products');
};

exports.sendProducts = async (req, res) => {
  // console.log('api');
  let response = {};
  try {
    // data tancha
    const products = { name: 'products' };
    response = {
      status: 'success',
      message: products
    };
  } catch (e) {
    console.log(e);
    response = {
      status: 'error',
      message: e.message
    };
  }
  res.json(response);
};
