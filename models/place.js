const {model, Schema, Types} = require('mongoose');

const thisSchema =  new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    image: {type: String, required: true},
    address: {type: String, required: true},
    description: {type: String, required: true},
    location: {
        lat: {type: Number, required: true},
        lng: {type: Number, required: true}
    },
    creator: {type: Types.ObjectId, required: true, ref: 'User'}
});

module.exports = model('Place', thisSchema);