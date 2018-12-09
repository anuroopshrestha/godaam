const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.addBrand = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        brands: req.body
      }
    },
    { new: true, runValidators: true }
  );
  req.flash('success', 'Brand has been added successfully');
  res.redirect(`/store/${req.params.id}`);
};

exports.editBrandModal = async (req, res) => {
  const store = await Store.findById(req.params.store);
  const selectedBrand = store.brands.filter((brand) => {
    return brand._id.equals(req.params.brand);
  });
  res.render('stores/modalForms/editBrand', { title: 'Edit brand', store, brand: selectedBrand[0] });
};

exports.saveBrand = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.store, 'brands._id': req.params.brand },
    { $set: { 'brands.$.name': req.body.name } }
  );
  req.flash('success', 'Brand updated successfully');
  res.redirect(`/store/${req.params.store}`);
};

exports.delBrand = async (req, res) => {
  await Store.findByIdAndUpdate(
    { _id: req.params.store},
    {
      $pull: {
        brands: { _id: req.params.brand}
      }
    }
  );
  // todo update products
  req.flash('success', 'Brand deleted successfully');
  res.redirect(`/store/${req.params.store}`);
};
