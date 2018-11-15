const passport = require('passport');

// const mail = require('../handlers/mailHandler');

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.checkAdmin = (req, res, next) => {
  if (req.user.role === 0) {
    next();
  } else {
    req.logout();
    req.flash('error', 'You don\'t have enough privileges.');
    res.redirect('/login');
  }
};

exports.sensitiveData = (req, res) => {
  res.json({
    status: 'Token Authenticated'
  });
};

exports.isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated() && req.user.role < 11) {
    next(); // carry on! They are logged in!
  } else {
    req.flash('info', 'You must be logged in as Admin to view this site.');
    res.redirect('/login');
  }
  return false;
};
