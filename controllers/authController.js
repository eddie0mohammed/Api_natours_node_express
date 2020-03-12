
const jwt = require('jsonwebtoken');
const util = require('util');

const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');


const signUp = catchAsync(async (req, res, next) => {

    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    });
    await newUser.save();

    const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(201).json({
        status: 'success',
        token: token,
        data: {
            user: newUser
        }
    });
});


const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //check if email and password exist
    if (!email || !password){
        return next(new appError('Please provide a valid email and password', 400));
    }

    // check if user exists and password is correct
    const user = await User.findOne({email: email})
                        .select('+password');

    if (!user) {
        return next(new appError('Please provide a valid email and password', 401));
    }

    const correct = await user.correctPassword(password, user.password);

    if (!correct){
        return next(new appError('Please provide a valid email and password', 401));
    }

    // if everything is correct, send token to client

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
     

    res.status(200).json({
        status: 'success',
        token: token
    })
})


const protect = catchAsync(async (req, res, next) => {

    // 1. Getting the token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token){
        return next(new appError('You are not logged in', 401));
    }

    // 2. Verification token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser){
        return next(new appError('The user no longer exists', 401));
    }

    // 4. Check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)){
        return new appError('Please login again', 401);
    }



    // Grant access to protected route
    req.user = freshUser;
    next();
});


const restrictTo = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)){
            return next(
                new appError('You do not have permission to perform this action', 403)
            )
        }
    }
    next();
}



module.exports = {
    signUp: signUp,
    login: login,
    protect: protect,
    restrictTo: restrictTo
}