const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');
const storeController = require('../controllers/storeController');

// API
router.get('/api/products', productController.sendProducts);
router.get('/api/brands', storeController.sendStore);

module.exports = router;
