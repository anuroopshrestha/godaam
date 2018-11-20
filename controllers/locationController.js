const mongoose = require('mongoose');
const Location = mongoose.model('Location');
const storeController = require('./userController');

exports.locationsPage = async (req, res) => {
  let query = {};
  if (req.user.role > 0) query = { store: req.user._id };
  const locations = await Location
    .find(query)
    .populate({
      path: 'store',
      select: 'store'
    });
  res.render('locations/all', { title: 'Locations', locations });
};

exports.addLocationPage = async (req, res) => {
  if (req.user.role === 0) {
    const stores = await storeController.getStoreList();
    res.render('locations/new', { title: 'Add New Location', stores });
  } else {
    res.render('locations/new', { title: 'Add New Location' });
  }
};

exports.editLocationPage = async (req, res) => {
  const location = await Location.findOne({ _id: req.params.id });
  if (req.user.role === 0) {
    const stores = await storeController.getStoreList();
    res.render('locations/edit', { title: 'Edit Location', location, stores });
  } else {
    res.render('locations/edit', { title: 'Edit Location', location });
  }
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
