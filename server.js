
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

app.listen(PORT, () => {
    console.log('Server listening on port ', PORT);
})
