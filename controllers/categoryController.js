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
