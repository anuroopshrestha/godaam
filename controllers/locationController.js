const mongoose = require('mongoose');
const Location = mongoose.model('Location');

exports.locationsPage = async (req, res) => {
  let query = {};
  if (req.user.role > 0) query = { store: req.user._id };
  const locations = await Location.find(query);
  res.render('locations/all', { title: 'Locations', locations });
};

exports.addLocationPage = (req, res) => {
  res.render('locations/new', { title: 'Add Location' });
};

exports.editLocationPage = async (req, res) => {
  const location = await Location.findOne({ _id: req.params.id });
  res.render('locations/edit', { title: 'Edit Location', location });
};

exports.addLocation = async (req, res) => {
  const location = new Location(req.body);
  await location.save();
  req.flash('info', 'Location has been added successfully.');
  res.redirect('/locations');
};

exports.saveLocation = async (req, res) => {
  const location = Location.findOne({ _id: req.params.id });
  location.update(req.body);
  location.save();
  req.flash('info', 'Location has been update.');
  res.redirect('/locations');
};
