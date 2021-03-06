const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slugs');

const productSchema = new Schema({
  name: {
    type: String,
    required: 'Name must be supplied'
  },
  SKU: {
    type: Number,
    required: 'SKU must be supplied'
  },
  stock: {
    type: Number,
    required: 'Stock must be supplied'
  },
  location: {
    type: mongoose.Schema.ObjectId,
    required: 'Location must be supplied'
  },
  price: {
    type: Number,
    required: 'Price must be supplied'
  },
  brand: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Store'
  },
  categories: [{
    type: mongoose.SchemaTypes.ObjectId,
    required: 'Category must be supplied'
  }],
  image: String,
  created: {
    type: Date,
    default: Date.now
  }
});

productSchema.pre('save', async function(next) {
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

module.exports = mongoose.model('Product', productSchema);
