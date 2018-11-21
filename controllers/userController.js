const mongoose = require('mongoose');
const natgeo = require('national-geographic-api').NationalGeographicAPI;
const User = mongoose.model('User');
const mail = require('../handlers/mailHandler');

exports.getUsers = async () => {
  const users = await User.find({ role: { $gt: 0 } });
  return users;
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

exports.checkUser = async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });
  if (user) {
    next();
  } else {
    throw new Error('User not found');
  }
};

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  // req.sanitizeBody('email').normalizeEmail({
  //   remove_dots: false,
  //   remove_extension: false,
  //   gmail_remove_subaddress: false
  // });
  req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
  req.checkBody('confirm-password', 'Confirmed Password cannot be blank!').notEmpty();
  req.checkBody('confirm-password', 'Your passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    req.flash('danger', errors.map(err => err.msg));
    res.render('users/new', { title: 'Add New User', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  next(); // there were no errors!
};

exports.validateUserUpdate = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  if (req.body.password) {
    req.checkBody('confirm-password', 'Confirmed Password cannot be blank!').notEmpty();
    req.checkBody('confirm-password', 'Your passwords do not match').equals(req.body.password);
  }
  const errors = req.validationErrors();
  if (errors) {
    console.error(errors);
    req.flash('danger', errors.map(err => err.msg));
    res.render('users/edit', { title: 'Edit User', editUser: req.body, flashes: req.flash() });
    return;
  }
  next();
};

exports.updateUser = async (req, res) => {
  await User.findOneAndUpdate({ _id: req.params.id }, req.body);
  if (req.body.password) {
    const user = await User.findOne({ _id: req.params.id });
    await user.setPassword(req.body.password);
    await user.save();
  }
  req.flash('info', 'User has been updated successfully.');
  res.redirect('/users');
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
      password: req.body.password,
      url: '/login' // TODO dynamic url
    });
    req.flash('info', 'New user has been added');
    res.redirect('/users');
  } catch (e) {
    console.log(e);
    req.flash('error', 'An unexpected error occurred. Please try again.');
    res.redirect('/users/new');
  }
};

exports.usersPage = async (req, res) => {
  const users = await User.find(
    {
      role: { $eq: 1 }
    }
  );
  res.render('users/all', { title: 'Users', users });
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

exports.editUserPage = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.render('users/edit', { title: 'Edit User', editUser: user });
  } catch (e) {
    console.log(e);
    req.flash('An unexpected error has occurred. Please try again.');
    res.redirect('/users');
  }
};
