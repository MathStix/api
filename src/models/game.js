const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    // Code is a 4 digit random string
    code: { type: String, default: require("randomstring").generate(4) },
    word: String,
    isStarted: { type: Boolean, default: false },
    startTime: { type: Date, default: null },
    teamIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Team", default: [] },
    ],
    playerIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Player", default: [] },
    ],
  },
  { collection: "games" }
);

module.exports = mongoose.model("Game", gameSchema);
