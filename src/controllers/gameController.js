const games = require('../models/game');
const players = require('../models/player');

module.exports = function (app) {

  //teams ophalen die in de game zitten.
  app.get("/getteams", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,

    //huidige Game ophalen.
    await games.findOne({ _id: body._id }).populate({ path: "teamIds", populate: { path: "playerIds" } })
      .then(async (foundGame) => {
        res.status(200).send(foundGame);

        //websocket aanroepen om naar alle gebruikers te sturen dat de game gaat beginnen.
        var obj = {
          type: 'event',
          eventName: 'startGame',
          clients: foundGame.playerIds,
          message: 'startGame'
        };
        app.eventEmit(JSON.stringify(obj));

      }).catch((err) => {
        console.log(err);
        res.status(404).send("Game not found");
      });
  });

  //game aanmaken.
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

    await games.findOne({ _id: body._id })
      .then((foundGame) => {
        res.status(200).json(foundGame);
      });
  });

  //Player een team laten joinen.
  app.post("/addplayer", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // deviceId: String,
    // gameCode: String

    await games
      .findOne({ code: body.gameCode })
      .then(async (foundGame) => {

        if (foundGame.code === body.gameCode) {

          await players.findOne({ deviceId: body.deviceId })
            .then(async (foundPlayer) => {
              if (foundPlayer !== null) {
                // als speler er niet inzit zet em erin.
                if (!foundGame.playerIds.includes(foundPlayer.playerId)) {
                  foundGame.playerIds.push(foundPlayer.playerId);

                  await foundGame.save();
                }

                res.status(201).json({_id: foundGame._id});
              }
              else {
                res.status(404).send("Player not found");
              }

            })
        }
        else {
          res.status(400).json("Incorrect code");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send("Game not found");
      });
  });

  //Exercise toevoegen aan course.
  app.post("/start", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,

    await games
      .findOne({ _id: body._id }).populate({ path: "teamIds", populate: { path: "playerIds" } })
      .then(async (foundGame) => {

        if (!foundGame.isStarted) {
          foundGame.isStarted = true,
            foundGame.startTime = new Date().toString();

          await foundGame.save();

          //websocket aanroepen om naar alle gebruikers te sturen dat de game gaat beginnen.
          var obj = {
            type: 'event',
            eventName: 'startGame',
            clients: foundGame.playerIds,
            message: 'startGame'
          };
          app.eventEmit(JSON.stringify(obj));

          res.status(201).json("Game started");
        }
        else {
          res.status(400).send("Game already started");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send("Game not found");
      });
  });
}