const mongoose = require('mongoose');
const natgeo = require('national-geographic-api').NationalGeographicAPI;
const User = mongoose.model('User');
const mail = require('../handlers/mailHandler');

exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

exports.loginForm = async (req, res) => {
  let photo = '';
  await natgeo.getPhotoOfDay()
    .then((response) => {
      photo = response.data[0].attributes.image.uri;
    });
  res.render('login', { title: 'Login', background: photo });
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('store.name', 'Store name is empty').notEmpty();
  req.checkBody('store.location.address', 'Store address is empty').notEmpty();
  req.checkBody('store.locations.coordinates[0]', 'Longitude is empty').notEmpty();
  req.checkBody('store.locations.coordinates[1]', 'Lattitude is empty').notEmpty();
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('confirm-password', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('confirm-password', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    req.flash('danger', errors.map(err => err.msg));
    res.render('users/new', { title: 'Add New User', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.registerUser = async (req, res) => {
  req.body.role = 1;
  try {
    const user = new User(req.body);
    await User.registerAsync(user, req.body.password);
    mail.send({
      user,
      filename: 'login-details',
      subject: 'Your login details',
      username: req.body.email,
      password: req.body.password
    });
  } catch (e) {
    console.log(e);
    req.flash('error', 'An unexpected error occurred. Please try again.');
    res.redirect('/users/new');
  }
};

exports.usersPage = async (req, res) => {
  try {
    const users = await User.find({
      role: { $eq: 1 }
    });
    res.render('users/all', { title: 'Users', users });
  } catch (e) {
    console.log(e);
    req.flash('error', 'An unexpected error has occurred. Please try again');
    res.redirect('/');
  }
};

exports.addNewUserPage = (req, res) => {
  try {
    res.render('users/new', { title: 'Add New User' });
  } catch (e) {
    console.log(e);
    req.flash('error', 'An unexpected error has occurred. Please try again');
    res.redirect('/');
  }
};
