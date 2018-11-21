const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slugs');

// Warehouse Child Schema
const warehouseSchema = new Schema({
  name: {
    type: String,
    required: 'Warehouse name is required.'
  },
  slug: String,
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
});

warehouseSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const parent = this.parent;
  const housesWithSlug = await this.constructor.find({ slug: slugRegEx, parent });
  if (housesWithSlug.length) {
    this.slug = `${this.slug}-${housesWithSlug.length + 1}`;
  }
  next();
});

// Brand Child Schema

const brandSchema = new Schema({
  name: {
    type: String,
    required: 'Name must be supplied'
  },
  slug: {
    type: String
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
  const brandsWithSlug = await this.constructor.find({ slug: slugRegEx, parent });
  if (brandsWithSlug.length) {
    this.slug = `${this.slug}-${brandsWithSlug.length + 1}`;
  }
  next();
});

// Category Child Schema

const categorySchema = new Schema({
  name: {
    type: String,
    required: 'Name must be supplied.'
  },
  slug: String,
  parent: mongoose.Schema.Types.ObjectId,
  picture: String,
  identifier: {
    image: String,
    color: String
  }
});

categorySchema.pre('save', async function(next) {
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

// Parent Schema

const storeSchema = new Schema({
  name: {
    type: String,
    required: 'Store name is required.'
  },
  slug: String,
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
  },
  registration: {
    code: String,
    date: Date
  },
  users: {
    admin: mongoose.SchemaTypes.ObjectId,
    editors: [mongoose.SchemaTypes.ObjectId]
  },
  warehouses: [warehouseSchema],
  brands: [brandSchema],
  categories: [categorySchema]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const parent = this.parent;
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx, parent });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model('Store', storeSchema);
