const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const appError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');



const app = express();



//GLOBAL middlewares

//Helmet: set security HTTP headers
app.use(helmet());

//morgan: logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//bodyparser => read data from body into req.body
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//prevent parameter polution
app.use(hpp({
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

//serve static file
app.use(express.static(path.join(__dirname, 'public')));

// rate limit : security -> limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP. Try again later...'
});

app.use('/api', limiter);


//routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



//undefined routes
app.all('*', (req, res, next) => {

    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    next(new appError(`Can't find ${req.originalUrl} on this server`, 404));
});


app.use(errorController);



module.exports = app;