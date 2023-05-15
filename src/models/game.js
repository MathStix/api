const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    code: String,
    isStarted: Boolean,
    startTime: Date,
    teamIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: [] }],
    playerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: [] }],
    
}, { collection: 'games' });

module.exports = mongoose.model('Game', gameSchema);