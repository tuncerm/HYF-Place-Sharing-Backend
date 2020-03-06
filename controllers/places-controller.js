const uuid = require('uuid/v4');
const {validationResult} = require('express-validator');


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

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if(!place){
        throw new HttpError('Could not find a place for the provided id.', 404);
    }

    res.json({place});
}

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    });

    if(!places){
        return next(new HttpError('Could not find a place for the provided id.', 404));
    }

    res.json({places});
}

const createPlace = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError('Invalid inputs detected.', 422));
    }

    const { title, description, coordinates, address, creator } = req.body;

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    }

    DUMMY_PLACES.push(createdPlace);

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