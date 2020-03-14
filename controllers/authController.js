
const jwt = require('jsonwebtoken');
const util = require('util');
const crypto = require('crypto');

const User = require('../models/user');

const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const sendMail = require('../utils/email');


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
        next();
    }
}


const forgotPassword = catchAsync(async (req, res, next) => {

    //get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user){
        return new appError('No user found with this email address', 404);
    }

    //generate random reset password
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget your password, please ignore this email.`;
 
    try{

    
        await sendMail({
            email: user.email,
            subject: 'Your password reset token is valid for 10 mins',
            message: message
        });
        
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email'
        })

    }catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new appError('There was an error sending the email. Try again later...', 500));
    }
});



const resetPassword = catchAsync(async (req, res, next) => {

    // 1. get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now()} });

    // 2. if token is not expired, and there is user, set the new password
    if (!user){
        return next(new appError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();


    // 3. update changePasswordAt property for the user

    // 4. log the user in, send JWT
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
     

    res.status(200).json({
        status: 'success',
        token: token
    })

})


const updatePassword = catchAsync(async (req, res, next) => {

    // 1. Get user from collection 
    const user = await User.findById(req.user.id).select('+password');

    // 2. check if posted current password is correct
    if (!(await user.correctPassword(req.body.currentPassword, user.password))){
        return next(new appError('Your current password is wrong', 401));

    }

    // 3. if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4. Log user in, send JWT
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
     

    res.status(200).json({
        status: 'success',
        token: token
    })


})



module.exports = {
    signUp: signUp,
    login: login,
    protect: protect,
    restrictTo: restrictTo,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    updatePassword: updatePassword
}