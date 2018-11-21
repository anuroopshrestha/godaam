const passport = require('passport');

// const mail = require('../handlers/mailHandler');

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/'
});

exports.checkAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 0) {
    next();
  } else {
    req.logout();
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
