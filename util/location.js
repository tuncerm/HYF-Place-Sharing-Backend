const axios = require('axios');

const API_KEY = "ASD";

const HttpError = require('../models/http-error');

async function getCoordsForAddress(address) {
    return {lat: 34.3223412, lng: -73.3325543}

    // const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`)
    
    
    // const data = response.data;

    // if(!data || data.status === 'ZERO_RESULTS'){
    //     const error = new HttpError('Could not fould the location for the given address.', 422);
    //     throw(error);
    // }

    // const coordinates = data.results[0].geometry.location;

    // return coordinates;
}

module.exports = getCoordsForAddress;