const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title : String,
    description: String,
    teacherId : { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'},
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', default: [] }]
}, { collection: 'courses' });

module.exports = mongoose.model('Course', courseSchema);