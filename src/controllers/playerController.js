let players = require("../models/player");

module.exports = function (app) {
  //Player aanmaken.
  app.post("/player", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // deviceId: String,
    // name: String,

    // Create player.
    let player = new players({
      deviceId: body.deviceId,
      name: body.name,
    });

    await players
      .findOneAndUpdate({ deviceId: body.deviceId }, { name: body.name })
      .then(async (foundPlayer) => {
        foundPlayer.name = body.name;
        await foundPlayer.save();
        res.status(201).json(foundPlayer);
      })     
      .catch((err) => {
        player
          .save()
          .then((savedPlayer) => {
            res.status(201).json(savedPlayer);
          })
          .catch((err) => {
            console.log(err.errors);
            res.status(400).send(err.errors);
          });
      });
  });
};
