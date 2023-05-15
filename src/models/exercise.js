const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    title : String,
    description: String,
    answer: String,
    location: String,
    photo: String,
    activationRange: String,
    exerciseType: String

}, { collection: 'exercises' });

module.exports = mongoose.model('Exercise', exerciseSchema);