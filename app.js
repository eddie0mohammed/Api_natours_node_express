const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');



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




module.exports = app;