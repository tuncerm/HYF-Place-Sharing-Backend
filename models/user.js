const {model, Schema} = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const thisSchema =  new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 6},
    image: {type: String, required: true},
    places: {type: String, required: true}
});

thisSchema.plugin(uniqueValidator);

module.exports = model('User', thisSchema);