const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.addWarehouse = async (req, res) => {
  await Store.findOneAndUpdate(
    { _id: req.params.id },
    {
      $push: {
        warehouses: req.body
      }
    },
    { new: true, runValidators: true }
  );
  req.flash('success', 'Warehouse has been added successfully.');
  res.redirect(`/store/${req.params.id}`);
};
