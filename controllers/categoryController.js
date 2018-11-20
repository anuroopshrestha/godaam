const mongoose = require('mongoose');
const Category = mongoose.model('Category');

const userController = require('./userController');

exports.categoriesPage = async (req, res) => {
  let query = {};
  if (req.user.role > 0) query = { store: req.user._id };
  const categories = Category
    .find(query)
    .populate({
      path: 'store',
      select: 'store'
    });
  if (req.user.role > 0) {
    const stores = await userController.getStoreList();
    res.render('categories/all', { title: 'Categories', categories, stores });
  }
};
