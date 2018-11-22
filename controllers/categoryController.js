const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.addCategory = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        categories: req.body
      }
    },
    { new: true, runValidators: true }
  );
  req.flash('success', 'Category has been added successfully.');
  res.redirect(`/store/${req.params.id}`);
};

exports.editCategoryModal = async (req, res) => {
  const store = await Store.findById(req.params.store);
  const selectedCategory = store.categories.filter((category) => {
    return category._id.equals(req.params.cat);
  });
  res.render('stores/modalForms/editCat', { title: 'Edit Category', store, category: selectedCategory[0] });
};

exports.saveCategory = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.store, 'categories._id': req.params.cat },
    { $set: { 'categories.$.name': req.body.name } }
  );
  req.flash('success', 'Category updated successfully');
  res.redirect(`/store/${req.params.store}`);
};
