const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Store = mongoose.model('Store');

exports.productsPage = async (req, res) => {
  const stores = await Store.find();
  // res.json(stores);
  res.render('products/all', {title: 'Products'});
};

exports.addProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  req.flash('info', 'New product has been added!');
  res.redirect('/products');
  req.flash('error', 'An unexpected error has occured.');
  res.redirect('/products');
};
