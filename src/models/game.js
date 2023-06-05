const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    // Code is a 4 digit random string
    code: { type: String, default: generateRandomNumbersString },
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

function generateRandomNumbersString() {
  const numbers = [];
  for (let i = 0; i < 4; i++) {
    const randomNum = Math.floor(Math.random() * 10);
    numbers.push(randomNum);
  }
  return numbers.join('');
}

module.exports = mongoose.model("Game", gameSchema);
