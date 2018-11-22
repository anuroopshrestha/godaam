const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.addBrand = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        brands: req.body
      }
    }
  );
  req.flash('info', 'Brand has been added successfully');
  res.redirect(`/store/${req.params.id}`);
};

exports.editBrand = (req, res) => {
  console.log('EDIT');
}
