const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slugs');

const brandSchema = new Schema({
  name: {
    type: String,
    required: 'Name must be supplied'
  },
  slug: {
    type: String
  },
  store: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  created: {
    type: Date,
    default: Date.now
  },
  image: String
});

brandSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const parent = this.parent;
  const categoriesWithSlug = await this.constructor.find({ slug: slugRegEx, parent });
  if (categoriesWithSlug.length) {
    this.slug = `${this.slug}-${categoriesWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model('Brand', brandSchema);
