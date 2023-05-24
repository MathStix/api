const games = require('../models/game');

module.exports = function (app) {

  app.post("/game", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // courseId: String,
    // word: String,

    let game = new games({
      courseId: body.courseId,
      word: body.word.toLowerCase()
    });

    await game.save().then((savedGame) => {
      res.status(201).json(savedGame);
    }).catch((err) => {
      res.status(400).send(err.errors);
    });
  });

  //Game ophalen aan GameId.
  app.get("/game", async (req, res) => {
    // Get body from request
    let body = req.body;

    games.findOne({ _id: body._id })
      .then((foundGame) => {
        res.status(200).json(foundGame);
      });
  });

  //Exercise toevoegen aan course.
  app.post("/addplayer", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,
    // playerId: String,

    games
      .findOne({ _id: body._id })
      .then(async (foundGame) => {

        foundGame.playerIds.push(body.playerId)

        await foundGame.save();

        res.status(201).json("Player joined");
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send("Game not found");
      });
  });
}