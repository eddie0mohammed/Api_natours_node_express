
const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();


router.get('/', userController.getAllUsers);

router.post('/', userController.createUser);

router.get('/:id', userController.getSpecificUser);

router.patch(':id', userController.updateUser);

router.delete('/:id', userController.deleteUser);


router.post('/signup', authController.signUp);

router.post('/login', authController.login);


module.exports = router;