const mongoose = require('mongoose');

require('dotenv').config({path: 'variables.env'});

// Connect to our Database and handle an bad connections
// Using `mongoose.connect`...
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// Import Models
require('../models/User');
require('../models/Category');
require('../models/Brand');
require('../models/Location');

// Start our app!
const app = require('../app');
app.set('port', process.env.PORT || 8080);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
