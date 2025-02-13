const express = require('express');
const router = express.Router();
const userController = require('../Controllers/authUserController');

// Register User Route (Send OTP)
router.post('/register', userController.registerUser);

// Verify OTP and Complete Registration Route
router.post('/verify-otp', userController.verifyOTP);

router.get('/', userController.getAllUsers);

router.post('/forgot-password', userController.forgotPassword);
// Login User Route
router.post('/login', userController.loginUser);


router.get('/:id', userController.getUserDetailsByID)

module.exports = router;