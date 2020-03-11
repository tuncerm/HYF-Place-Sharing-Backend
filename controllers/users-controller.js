const uuid = require('uuid/v4');
const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;

    try{
        users = await User.find({}, '-password').exec();
    } catch {
        return next(new HttpError('Something Went Wrong!', 500));
    }

    res.json({users: users.map(user=>user.toObject({getters: true}))});
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs detected.', 422));
    }
    
    const {name, email, password, image} = req.body;

    let existingUser;

    try{
        existingUser = await User.findOne({email}).exec();
    } catch {
        return next(new HttpError('Something went wrong!', 500));
    }

    if(existingUser){
        return next(new HttpError('User already exist!', 422));
    }

    const createdUser = new User({
        name,
        email,
        password,
        image: 'https://www.gettyimages.nl/detail/foto/monument-valley-glow-royalty-free-beeld/1007019940',
        places: []
    });

    try{
        await createdUser.save();
    } catch (error){
        return next(new HttpError('Failed to create User', 500));
    }

    res.status(201).json({user: createdUser.toObject({getters: true})});
}

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;

    try{
        existingUser = await User.findOne({email}).exec();
    } catch {
        return next(new HttpError('Something went wrong!', 500));
    }

    if(!existingUser || password !== existingUser.password){
        return next(new HttpError('Invalid credentials!', 401));
    }

    res.json({message: 'Logged in!'});
}

module.exports = {
    getUsers,
    signup,
    login
}