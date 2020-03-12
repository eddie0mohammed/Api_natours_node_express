
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});


const app = require('./app');



// db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('connected to DB');
})


const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log('Server listening on port ', PORT);
})


process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION, Server shutting down');

    server.close(() => {
        process.exit(1);
    })
});

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION, Server shutting down...');

    process.exit(1);
})