const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const locationsController = require('../controllers/locationsController');
const homeController = require('../controllers/homeController');
const categoryController = require('../controllers/categoryController');
const brandController = require('../controllers/brandController');

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// USERS
// -- REGISTER ADMIN
router.get('/register', userController.registerForm);

// -- STORE ADMINS
router.get('/users', authController.checkAdmin, userController.usersPage);
router.get('/users/new', authController.checkAdmin, userController.addNewUserPage);
router.post('/users/new', authController.checkAdmin, userController.validateRegister, userController.registerUser);

router.get(
  '/',
  authController.isLoggedIn,
  homeController.homePage
);

// LOCATIONS
router.get('/locations', locationsController.allLocations);

// CATEGORIES
router.get('/categories', authController.isLoggedIn, categoryController.categoriesPage);

// BRANDS
router.get('/brands', authController.isLoggedIn, brandController.brandsPage);
router.post('/brands', authController.isLoggedIn, brandController.addBrand);
// router.get('/brands/:id');
// router.post('/brands/:id');

module.exports = router;
