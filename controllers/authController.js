const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

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

const getToken = (user) => {
  const payload = {
    email: user.email
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

exports.apiLogin = (req, res, next) => {
  passport.authenticate('local', function(err, user) {
    if (err) {
      const response = {
        status: 'error',
        message: 'Unknown Error'
      };
      res.json(response);
      return;
    }
    if (!user) {
      const response = {
        status: 'auth-error',
        message: 'The email and/or password is wrong. Please try again'
      };
      res.json(response);
      return;
    }
    if (user.verified.status === 'false') {
      const response = {
        status: 'not-verified',
        message: 'Your email has not been verified yet. Please check your email for verification code'
      };
      res.json(response);
      return;
    }
    req.user = user;
    next();
  })(req, res, next);
};

exports.apiAuthenticate = passport.authenticate('jwt', { session: 'false' });

exports.refreshToken = (req, res) => {
  res.json({
    status: 'success',
    user: {
      name: req.user.name,
      email: req.user.email,
      id: req.user._id,
      picture: req.user.picture,
      updated: req.user.verified.profileUpdated,
      follows: req.user.follows,
      role: req.user.role,
      initiateFollows: req.user.verified.initiateFollows,
      notifications: req.user.notifications
    }
  });
};

exports.sendToken = (req, res) => {
  res.json({
    status: 'success',
    token: getToken(req.user),
    user: {
      name: req.user.name,
      email: req.user.email,
      id: req.user._id,
      picture: req.user.picture,
      updated: req.user.verified.profileUpdated,
      follows: req.user.follows,
      role: req.user.role,
      initiateFollows: req.user.verified.initiateFollows,
      notifications: req.user.notifications
    }
  });
};
