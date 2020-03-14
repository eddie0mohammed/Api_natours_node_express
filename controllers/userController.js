
const express = require('express');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');


const getAllUsers = catchAsync(async (req, res) => {

    const users = await User.find();

    res.status(200).json({
        status: 'Success',
        data: {
            users: users
        }
    })

})

const createUser = (req, res) => {


}

const getSpecificUser = (req, res) => {

}

const updateUser = (req, res) => {

}

const deleteUser = (req, res) => {

}


const filterObj = (obj, ...allowedFields) => {

    const newObj = {};
    Object.keys(obj).forEach(elem => {
        if (allowedFields.includes(elem)){
            newObj[elem] = obj[elem];
        }
    })
    return newObj;
}


const updateMe = catchAsync(async (req, res, next) => {
    // 1. create error if user posts password data
    if (req.body.password || req.body.confirmPassword){
        return next(new appError('This route is not for password updates.', 400));
    }


    // 2. filter unwanted field names from body
    const filteredBody = filterObj(req.body, 'name', 'email');
    
    // 3. update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody , {
        new: true, 
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        user: updatedUser
    })

});





module.exports = {
    getAllUsers: getAllUsers,
    createUser: createUser,
    getSpecificUser: getSpecificUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    updateMe: updateMe
}