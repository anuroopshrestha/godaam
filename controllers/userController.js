const mongoose = require('mongoose');
const natgeo = require('national-geographic-api').NationalGeographicAPI;
const User = mongoose.model('User');

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
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('confirm-password', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('confirm-password', 'Oops! Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('danger', errors.map(err => err.msg));
    res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.register = async (req, res, next) => {
  const user = new User(req.body);
  // const register = promisify(User.register, User);
  await User.registerAsync(user, req.body.password);
  next(); // pass to authController.login
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

exports.addNewUser = (req, res) => {
  try {
    res.render('users/new', { title: 'Add New User' });
  } catch (e) {
    console.log(e);
    req.flash('error', 'An unexpected error has occurred. Please try again');
    res.redirect('/');
  }
};
