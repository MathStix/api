const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: String,
    playerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player', default: [] }],
    completedExerciseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', default: [] }],
    unlockedExerciseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', default: [] }],
    timePenalty: Number,
    guessCooldown: String,
    guessedLetters: [Number],
    finishTime: String,
    
}, { collection: 'teams' });

module.exports = mongoose.model('Team', teamSchema);