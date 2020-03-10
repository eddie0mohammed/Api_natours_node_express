
const express = require('express');

const tourController = require('../controllers/tourController');

const router = express.Router();




router.get('/', tourController.getAllTours);  

router.post('/', tourController.postNewTour);

router.get('/:id', tourController.getSpecificTour);

router.patch('/:id', tourController.updateSpecificTour);

router.delete('/:id', tourController.deleteTour);



module.exports = router;