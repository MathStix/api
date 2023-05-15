const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
    title : String,
    description: String,
    answer: String,
    location: String,
    photo: String,
    activationRange: String,
    exerciseType: String,
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},

}, { collection: 'exercises' });

module.exports = mongoose.model('Exercise', exerciseSchema);