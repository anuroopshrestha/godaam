const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [{ validator: value => validator.isEmail(value), msg: 'Email already exists.' }],
    required: 'Please supply an Email Address'
  },
  slug: String,
  name: {
    type: String,
    required: 'Please supply a Name',
    trim: true
  },
  role: {
    type: Number,
    default: 50
  },
  resetPassword: {
    token: String,
    expires: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.index({
  name: 'text'
});

// https://github.com/saintedlama/passport-local-mongoose/issues/218
userSchema.statics.registerAsync = function (data, password) {
  return new Promise((resolve, reject) => {
    this.register(data, password, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
