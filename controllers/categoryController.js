const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.categoriesPage = async (req, res) => {
  try {
    const categories = Category.find();
    res.render('categories/all', { title: 'Categories', categories });
  } catch (e) {
    console.log(e);
    req.flash('error', 'An unexpected error has occurred. Please try again.');
    res.redirect('/');
  }
};
