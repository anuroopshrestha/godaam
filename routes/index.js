const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const productController = require('../controllers/productController');
const brandController = require('../controllers/brandController');

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

// LOCATIONS
// router.get('/locations', catchErrors(locationController.locationsPage));
// router.get('/locations/new', catchErrors(locationController.addLocationPage));
// router.post('/locations/new', catchErrors(locationController.addLocation));
// router.get('/location/:id', catchErrors(locationController.editLocationPage));
// router.post('/location/:id', catchErrors(locationController.saveLocation));

// CATEGORIES
// router.get('/categories', categoryController.categoriesPage);

// BRANDS
// router.get('/brands', brandController.brandsPage);
// router.post('/brands', brandController.addBrand);
// router.get('/brand/:id', brandController.editBrand);
// router.post('/brand/:id', brandController.updateBrand);
// router.get('/brand/:id/del', brandController.deleteBrand);

// PRODUCTS
router.get('/products', productController.productsPage);
router.post('/products', productController.addProduct);

module.exports = router;
