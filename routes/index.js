const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const productController = require('../controllers/productController');
const storeController = require('../controllers/storeController');
const categoryController = require('../controllers/categoryController');
const brandController = require('../controllers/brandController');
const warehouseController = require('../controllers/warehouseController');

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
router.post(
  '/store/:store/addbrand',
  brandController.uploadBrandImg,
  brandController.catchUploadErrors,
  catchErrors(brandController.resizeBrandImg),
  catchErrors(brandController.addBrand)
);

router.get('/store/updatebrand/:store/:brand', catchErrors(brandController.editBrandModal));
router.post(
  '/store/updatebrand/:store/:brand',
  brandController.uploadBrandImg,
  brandController.catchUploadErrors,
  catchErrors(brandController.resizeBrandImg),
  catchErrors(brandController.saveBrand)
);
router.get('/store/deletebrand/:store/:brand', catchErrors(brandController.delBrand));

// STORES
router.get('/stores', catchErrors(storeController.storesPage));
router.get('/stores/new', catchErrors(storeController.addStorePage));
router.post('/stores/new', catchErrors(storeController.addStore));
router.get('/store/:id', catchErrors(storeController.editStorePage));

// PRODUCTS
router.get('/products', catchErrors(productController.productsPage));
router.get('/products/new', catchErrors(productController.addProductPage));
router.post('/products', catchErrors(productController.addProduct));

// CATEGORIES
router.post('/store/:id/addcat', catchErrors(categoryController.addCategory));
router.get('/store/updatecat/:store/:cat', catchErrors(categoryController.editCategoryModal));
router.post(
  '/store/updatecat/:store/:cat',
  categoryController.uploadPicture,
  categoryController.catchUploadErrors,
  catchErrors(categoryController.resizePicture),
  catchErrors(categoryController.saveCategory)
);
router.get('/store/deletecat/:store/:cat', catchErrors(categoryController.delCat));

// WAREHOUSES
router.post('/store/:id/addware', catchErrors(warehouseController.addWarehouse));

// API
// router.get('/api/products', productController.sendProducts);

module.exports = router;
