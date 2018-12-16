const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const helpers = require('./helpers');
const index = require('./routes/index');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const auth = require('./controllers/authController');
const userController = require('./controllers/userController');
const errorHandlers = require('./handlers/errorHandlers');

require('./handlers/passport');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator());

app.use(flash());

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  next();
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
  // res.json({data: [1, 2, 3, 4]})
});

app.get('/login', userController.loginForm);
app.post('/login', auth.login);
app.get('/logout', auth.logout);

// app.use('/api', apiRoutes);
app.all('/auth/*', authRoutes);
app.all('/api/*', apiRoutes);

// Secure all other URLs

app.use('/', auth.checkAdmin, index);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
// 	const err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });

// // error handler
// app.use(function (err, req, res) {
// 	// set locals, only providing error in development
// 	res.locals.message = err.message;
// 	res.locals.error = req.app.get('env') === 'development' ? err : {};

// 	// render the error page
// 	res.status(err.status || 500);
// 	res.render('error');
// });

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

module.exports = app;
