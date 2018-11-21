const mongoose = require('mongoose');
const Brand = mongoose.model('Brand');

const userController = require('./userController');

exports.brandsPage = async(req, res) => {
  let query = {};
  if (req.user.role > 0) query = { store: req.user._id };
  try {
    const brands = await Brand
      .find(query)
      .populate({
        path: 'store',
        select: 'store'
      });
    const stores = await userController.getStoreList();
    // res.json(brands);
    // return;
    res.render('brands/all', {title: 'Brands', brands, stores});
  } catch (e) {
    console.log(e);
  }
};

exports.addBrand = async (req, res) => {
  try {
    if (!req.body.store) {
      req.body.store = req.user._id;
    }
    const brand = new Brand(req.body);
    await brand.save();
    req.flash('info', 'New brand has been added!');
    res.redirect('/brands');
  } catch (e) {
    console.log(e);
    req.flash('error', 'An unexpected error has occured.');
    res.redirect('/brands');
  }
};

exports.editBrand = async (req, res) => {
  const brand = await Brand.findOne({ _id: req.params.id});
  // res.json(brand);
  res.render('brands/edit', {title: `Edit ${brand.name}`, brand});
};

exports.updateBrand = async (req, res) => {
  console.log('asd');
  // find and update the brand
  const brand = await Brand.findOneAndUpdate({ _id: req.params.id}, req.body);
  req.flash('info', `Successfully updated ${brand.name}`);
  res.redirect('/brands');
};

exports.deleteBrand = async (req, res) => {
  const brand = await Brand.findByIdAndRemove({ _id: req.params.id}, req.body);
  req.flash('info', `Successfully deleted ${brand.name}`);
  res.redirect('/brands');
};

// exports.getBrandList = async => {
//   const brands = await Brand.find({name});
//   return brands;
// };

exports.getBrandList = async () => {
  const stores = await Brand.find({name: {}});
  return stores;
};
