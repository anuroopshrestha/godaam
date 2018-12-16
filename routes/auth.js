const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// API REGISTER
router.post('/auth/register', authController.validateApiRegister, authController.apiRegister);
// LOGIN
router.post('/auth/login', authController.apiLogin, authController.sendToken);
// AUTHENTICATE
router.post('/auth/authenticate', authController.apiAuthenticate, authController.refreshToken);

module.exports = router;
