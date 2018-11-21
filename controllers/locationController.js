const mongoose = require('mongoose');
const Location = mongoose.model('Location');
const storeController = require('./userController');

exports.locationsPage = async (req, res) => {
  const stores = await storeController.getStoreList();
  const locations = await Location
    .find()
    .populate({
      path: 'store',
      select: 'store'
    });
  res.render('locations/all', { title: 'Locations', locations, stores });
};

exports.addLocationPage = async (req, res) => {
  const stores = await storeController.getStoreList();
  res.render('locations/new', { title: 'Add New Location', stores });
};

exports.editLocationPage = async (req, res) => {
  const location = await Location.findOne({ _id: req.params.id });
  const stores = await storeController.getStoreList();
  res.render('locations/edit', { title: 'Edit Location', location, stores });
};

exports.addLocation = async (req, res) => {
  const location = new Location(req.body);
  await location.save();
  req.flash('info', 'Location has been added successfully.');
  res.redirect('/locations');
};

exports.saveLocation = async (req, res) => {
  await Location.findOneAndUpdate({ _id: req.params.id }, req.body);
  req.flash('info', 'Location has been update.');
  res.redirect('/locations');
};
