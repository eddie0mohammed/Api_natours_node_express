
const express = require('express');

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');


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


module.exports = {
    getAllUsers: getAllUsers,
    createUser: createUser,
    getSpecificUser: getSpecificUser,
    updateUser: updateUser,
    deleteUser: deleteUser
}