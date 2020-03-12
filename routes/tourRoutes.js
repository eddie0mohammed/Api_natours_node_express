
const express = require('express');

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();




router.get('/', authController.protect, tourController.getAllTours);  

router.post('/', tourController.postNewTour);

router.get('/:id', tourController.getSpecificTour);

router.patch('/:id', tourController.updateSpecificTour);

router.delete('/:id', authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);



module.exports = router;