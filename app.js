const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const appError = require('./utils/appError');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const errorController = require('./controllers/errorController');



const app = express();


if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



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