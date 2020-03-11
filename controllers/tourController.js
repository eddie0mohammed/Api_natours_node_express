
const Tours = require('../models/tour');

const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');



const getAllTours = catchAsync(async (req, res, next) => {

        // Execute query
        const features = new APIFeatures(Tours.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const tours = await features.query;
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        })

});


const postNewTour = catchAsync(async (req, res, next) => {


        const newTour = new Tours(req.body);
        await newTour.save();

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    
})

const getSpecificTour = catchAsync(async (req, res, next) => {

    const id = req.params.id;

        const tour = await Tours.findById(id);
        if (!tour){
            return res.status(400).json({
                status:'fail',
                message: 'No tour found'
            })
        }
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })

})


const updateSpecificTour = catchAsync(async (req, res, next) => {

    const id = req.params.id;

        const updatedTour = await Tours.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!updatedTour){
            return res.status(400).json({
                status: 'fail',
                message: 'Couldn\'t find a tour'
            })
        }

        res.status(200).json({
            status: 'success',
            data: {
                tour: updatedTour
            }
        })

})


const deleteTour = catchAsync(async (req, res, next) => {

    const id = req.params.id;

        await Tours.findByIdAndDelete(id);
        res.status(200).json({
            status: 'success',
            message: 'item deleted'
        })
        
})




module.exports = {
    
    getAllTours: getAllTours,
    postNewTour: postNewTour,
    getSpecificTour: getSpecificTour,
    updateSpecificTour: updateSpecificTour,
    deleteTour: deleteTour,
}