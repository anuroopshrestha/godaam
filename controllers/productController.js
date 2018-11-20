const mongoose = require('mongoose');
const Product = mongoose.model('Product');
// const brandController = require('./brandController');

exports.productsPage = async (req, res) => {
  res.render('products/all', {title: 'Products'});
};

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    req.flash('info', 'New product has been added!');
    res.redirect('/products');
  } catch (e) {
    console.log(e);
    req.flash('error', 'An unexpected error has occured.');
    res.redirect('/products');
  }
};
