const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const productController = require('../controllers/productController');
const storeController = require('../controllers/storeController');
const categoryController = require('../controllers/categoryController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/login', userController.loginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// USERS
// -- REGISTER ADMIN
// router.get('/register', userController.registerForm);

// -- STORE ADMINS
router.get(
  '/users',
  catchErrors(userController.usersPage)
);
router.get('/users/new', userController.addNewUserPage);
router.post(
  '/users/new',
  userController.validateRegister,
  catchErrors(userController.registerUser)
);

// -- EDIT
router.get('/user/:id', userController.editUserPage);
router.post(
  '/user/:id',
  catchErrors(userController.checkUser),
  userController.validateUserUpdate,
  catchErrors(userController.updateUser)
);

router.get('/', homeController.homePage);

// STORES
router.get('/stores', catchErrors(storeController.storesPage));
router.get('/stores/new', catchErrors(storeController.addStorePage));
router.post('/stores/new', catchErrors(storeController.addStore));
router.get('/store/:id', catchErrors(storeController.editStorePage));

// PRODUCTS
router.get('/products', productController.productsPage);
router.post('/products', productController.addProduct);

// CATEGORIES
router.post('/store/:id/addcat', catchErrors(categoryController.addCategory));

module.exports = router;
