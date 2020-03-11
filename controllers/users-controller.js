const uuid = require('uuid/v4');
const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Havoc',
        email: 'a@b.c',
        password: 'testers'
    }
]

const getUsers = async (req, res, next) => {
    res.json({users: DUMMY_USERS});
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs detected.', 422));
    }
    
    const {name, email, password, image, places} = req.body;

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
        places: 'will be added'
    });

    try{
        await createdUser.save();
    } catch (error){
        return next(new HttpError('Failed to create User', 500));
    }

    res.status(201).json({user: createdUser.toObject({getters: true})});
}

const login = (req, res, next) => {
    const {email, password} = req.body;
    const identifiedUser = DUMMY_USERS.find(user=>user.email === email);
    if(!identifiedUser || identifiedUser.password !==password){
        return next(new HttpError('Could not identify user!', 401));
    }

    res.json({message: 'Logged in!'});
}

module.exports = {
    getUsers,
    signup,
    login
}