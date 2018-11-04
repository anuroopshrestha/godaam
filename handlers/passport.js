const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.initialize();
passport.use(User.createStrategy());

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
jwtOptions.secretOrKey = process.env.JWT_SECRET;

const strategy = new JwtStrategy(jwtOptions, async function(jwtPayload, done) {
  await User.findOne({email: jwtPayload.email}, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } return done(null, false);
    // or you could create a new account
  });
});

passport.use(strategy);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
