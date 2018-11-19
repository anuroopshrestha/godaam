const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const locationsController = require('../controllers/locationsController');
const homeController = require('../controllers/homeController');
const categoryController = require('../controllers/categoryController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// USERS
// -- REGISTER ADMIN
router.get('/register', userController.registerForm);

// -- STORE ADMINS
router.get('/users', authController.checkAdmin, userController.usersPage);
router.get('/users/new', authController.checkAdmin, userController.addNewUserPage);
router.post(
  '/users/new',
  authController.checkAdmin,
  userController.validateRegister,
  catchErrors(userController.registerUser)
);

// -- EDIT
router.get('/user/:id', authController.isLoggedIn, userController.editUserPage);
router.post(
  '/user/:id',
  authController.isLoggedIn,
  catchErrors(userController.checkUser),
  userController.validateUserUpdate,
  catchErrors(userController.updateUser)
);

router.get(
  '/',
  authController.isLoggedIn,
  homeController.homePage
);

// LOCATIONS
router.get('/locations', locationsController.allLocations);

// CATEGORIES
router.get('/categories', authController.isLoggedIn, categoryController.categoriesPage);

module.exports = router;
