const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slugs');

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
  store: {
    name: {
      type: String,
      required: 'Store name must be applied'
    },
    location: {
      type: {
        type: String,
        default: 'Point'
      },
      coordinates: [{
        type: Number,
        required: 'You must supply coordinates!'
      }],
      address: {
        type: String,
        required: 'You must supply an address!'
      }
    }
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

userSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const userssWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (userssWithSlug.length) {
    this.slug = `${this.slug}-${userssWithSlug.length + 1}`;
  }
  next();
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
