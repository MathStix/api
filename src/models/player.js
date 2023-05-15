const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
    deviceId : String,
    name: String,
}, { collection: 'players' });

module.exports = mongoose.model('Player', playerSchema);