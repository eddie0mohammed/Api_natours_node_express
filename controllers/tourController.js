
const Tours = require('../models/tour');

const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');



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
            return next(new appError('No tour found with that ID', 404));
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
             return next(new appError('No tour found with that ID', 404));
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

        const tour = await Tours.findByIdAndDelete(id);
        if (!tour){
            return next(new appError('No tour found with that ID', 404));
        }
        
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