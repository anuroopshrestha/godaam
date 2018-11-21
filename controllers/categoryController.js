const mongoose = require('mongoose');
const Category = mongoose.model('Category');

const userController = require('./userController');

exports.categoriesPage = async (req, res) => {
  const categories = Category
    .find()
    .populate({
      path: 'store',
      select: 'store'
    });
  const stores = await userController.getStoreList();
  res.render('categories/all', { title: 'Categories', categories, stores });
};
