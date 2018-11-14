const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const locationsController = require('../controllers/locationsController');
const homeController = require('../controllers/homeController');

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// USERS
router.get('/register', userController.registerForm);
router.post(
  '/register',
  userController.validateRegister,
  userController.register,
  authController.login
);

router.get(
  '/',
  authController.isLoggedIn,
  homeController.homePage
);

// LOCATIONS
router.get('/locations', locationsController.allLocations);

module.exports = router;
