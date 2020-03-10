const uuid = require('uuid/v4');
const {validationResult} = require('express-validator');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');

const HttpError = require('../models/http-error');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
        lat: 40.7484474,
        lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
];

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try{
        place = await Place.findById(placeId);
    } catch {
        return next(new HttpError('Could not find place', 500));
    }

    if(!place){
        return next(new HttpError('Could not find a place for the provided id.', 404));
    }

    res.json({place: place.toObject({getters: true})});
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let places;
    try{
        places = await Place.find({creator: userId});
    } catch {
        return next(new HttpError('Could not find place', 500));
    }

    if(!places || !places.length){
        return next(new HttpError('Could not find a place for the provided id.', 404));
    }

    res.json({places});
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs detected.', 422));
    }

    const { title, description, address, creator } = req.body;

    let coordinates;
    try{
        coordinates = await getCoordsForAddress(address);
    } catch (error){
        return next(error);
    }

    const createdPlace = new Place({
        title,
        description,
        location: coordinates,
        address,
        image: 'https://www.gettyimages.nl/detail/foto/monument-valley-glow-royalty-free-beeld/1007019940',
        creator
    })

    try{
        await createdPlace.save();
    } catch (error){
        return next(new HttpError('Failed to create place', 500));
    }

    res.status(201).json({place: createdPlace});
}

const updatePlaceById = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs detected.', 422));
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;

    const placeToUpdate = DUMMY_PLACES.find(p=>p.id===placeId);
    const placeIndex = DUMMY_PLACES.find(p=>p.id===placeId);
    const updatedPlace = {...placeToUpdate, title, description};

    DUMMY_PLACES[placeIndex] = updatedPlace;

    res.status(200).json({place: updatedPlace});
}

const deletePlaceById = (req, res, next) => {
    const placeId = req.params.pid;

    if(!DUMMY_PLACES.find(p=>p.id===placeId)){
        return next(new HttpError('A place with the given ID does not exist.', 404));
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p=>p.id !== placeId);
    res.status(200).json({message: `Deleted place: ${placeId}`});
}

module.exports = {
    getPlaceById,
    getPlacesByUserId,
    createPlace,
    updatePlaceById,
    deletePlaceById
}