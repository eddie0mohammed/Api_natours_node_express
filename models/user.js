const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'A user must have a name']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //this only works on SAVE()
            validator: function (el){
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    passwordChangedAt: Date
})

//hash password for signup
userSchema.pre('save', async function(next){
    // only run this function is password was actually modified
    if(!this.isModified('password')){
        return next();
    }
    // hash the newly created password
    this.password = await bcrypt.hash(this.password, 12);
    // delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
})

//compare password for login
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

//check if password changed (for authentication)

userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if (this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
        // console.log(this.passwordChangedAt, JWTTimestamp);

        return JWTTimestamp < changedTimestamp
    }
    
    //false means not changed
    return false;
}


const User = mongoose.model('User', userSchema);

module.exports =  User;