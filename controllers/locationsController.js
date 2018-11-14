exports.allLocations = (req, res) => {
  try {
    res.render('locations/all', { title: 'All Locations' });
  } catch (e) {
    req.flash('error', 'An unexpected error has occurred. Please try again.');
    res.redirect('/');
  }
};
