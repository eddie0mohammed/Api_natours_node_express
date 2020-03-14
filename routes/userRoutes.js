
const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();


router.get('/', userController.getAllUsers);

router.post('/', userController.createUser);

router.get('/:id', userController.getSpecificUser);

router.patch(':id', userController.updateUser);

router.delete('/:id', userController.deleteUser);


//auth
router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMe);

module.exports = router;