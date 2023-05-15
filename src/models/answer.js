const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
    texts : [String],
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    photos : [String],
    canvas : String,

}, { collection: 'answers' });

module.exports = mongoose.model('Answer', answerSchema);