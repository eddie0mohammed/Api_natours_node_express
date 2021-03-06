const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const Tours = require('../models/tour');


// db
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => {
    console.log('connected to DB');
})


//READ JSON FILE
const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tours-simple.json'), 'utf-8'));


//IMPORT DATA INTO DB
const importData = async () => {
    
    try{

        await Tours.create(tours);
        console.log('Data successfully loaded');
        
    }catch(err){
        console.log(err);
    }
}


//DELETE ALL DATA FROM DB
const deleteData = async () => {
    try{
        await Tours.deleteMany();
        console.log('Data successfully deleted');

    }catch(err){
        console.log(err);
    }
}


if (process.argv[2] === '--import'){
    importData();
}else if (process.argv[2] === '--delete'){
    deleteData();
}
