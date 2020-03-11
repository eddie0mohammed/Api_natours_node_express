
const mongoose = require('mongoose');


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour name must have max 40 characters'],
        minLength: [10, 'A tour name must have min 10 characters']
    },

    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },

    maxGroupSize: {
        type: Number,
        required: [true, 'A tour muyst have a group size']
    },

    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'hard'],
            message: "Difficulty is either: easy, medium or hard"
        }
    },

    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be between 1 and 5"],
        max: [5, "Rating must be between 1 and 5"]

    },

    ratingsQuantity: {
        type: Number,
        default: 0
    },

    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },

    priceDiscount: {
        type:Number,
        validate: {
            validator: function(val){
                return val < this.price;
            },
            message: 'Discount price ({VAlUE}) should be below regular price'
        }

    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },

    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    
    startDates: [Date]

})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;