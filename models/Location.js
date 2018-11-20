const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: {
    type: String,
    required: 'Name of the location must be supplied.'
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
  },
  store: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Location', locationSchema);
