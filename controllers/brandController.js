const mongoose = require('mongoose');
const Brand = mongoose.model('Brand');

exports.brandsPage = async(req, res) => {
  try {
    const brands = await Brand.find();
    console.log(brands);
    res.render('brands/all', {title: 'Brands', brands});
  } catch (e) {
    console.log(e);
  }
};

exports.addBrand = async (req, res) => {
  try {
    const brand = new Brand(req.body);
    await brand.save();
    console.log(brand.slug);
    req.flash('info', 'New brand has been added');
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
