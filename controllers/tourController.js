
const Tours = require('../models/tour');




const getAllTours = async (req, res) => {

    try{
        const tours = await Tours.find();
        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        })

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

}


const postNewTour = async (req, res) => {

    try{

        const newTour = new Tours(req.body);
        await newTour.save();

        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        })
    }

    
    
}

const getSpecificTour = async (req, res) => {

    const id = req.params.id;

    try {

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

    }catch (err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        })
    }
}


const updateSpecificTour = async (req, res) => {

    const id = req.params.id;

    try{
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

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        })
    }

}


const deleteTour = async (req, res) => {

    const id = req.params.id;

    try{

        await Tours.findByIdAndDelete(id);
        res.status(200).json({
            status: 'success',
            message: 'item deleted'
        })
        

    }catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            error: err
        })
    }
}




module.exports = {
    
    getAllTours: getAllTours,
    postNewTour: postNewTour,
    getSpecificTour: getSpecificTour,
    updateSpecificTour: updateSpecificTour,
    deleteTour: deleteTour,
}