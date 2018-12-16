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
    user: req.user
  });
};

exports.validateApiRegister = (req, res, next) => {
  req.sanitizeBody('fName');
  req.checkBody('fName', 'First name is empty').notEmpty();
  req.checkBody('lName', 'Last name is empty').notEmpty();
  req.checkBody('email', 'You must supply an email address.').notEmpty();
  req.checkBody('email', 'The Email Address is not valid').isEmail();
  req.checkBody('password', 'Password cannot be blank').notEmpty();
  req.checkBody('password', 'Password must be at least 6 characters long').isLength({min: 6});
  req.checkBody('password', 'Password must contain at least one number').matches(/\d/);
  req.checkBody('confirmPassword', 'Confirmed password cannot be empty').notEmpty();
  req.checkBody('confirmPassword', 'Your passwords do not match').equals(req.body.password);
  const errors = req.validationErrors();
  if (errors) {
    const registerErrors = errors.map(error => error.msg);
    const response = {
      status: 'validate-error',
      message: registerErrors
    };
    res.json(response);
    return; // stop the fn from running
  }
  next();
};

exports.apiRegister = async(req, res) => {
  try {
    const verificationCode = Math.floor(Math.random() * (999999 - 100000) + 100000);
    req.body.role = 30;
    req.body.verified = {
      status: 'false',
      profileUpdated: 'false',
      verificationCode,
      initiateFollows: 'false'
    };
    const user = new User(req.body);
    await User.registerAsync(user, req.body.password);
    // mail.send({
    //   user,
    //   filename: 'email-verification',
    //   subject: 'Verify your email',
    //   code: verificationCode
    // });
    const response = {
      status: 'success',
      message: 'Please check your email for verification.'
    };
    res.json(response);
  } catch (e) {
    console.log(e);
    const response = {
      status: 'error',
      message: e.message
    };
    res.json(response);
  }
};
