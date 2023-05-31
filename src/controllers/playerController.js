let players = require('../models/player');

module.exports = function (app) {

    //Player aanmaken.
    app.post('/player', async (req, res) => {
        let body = req.body;
        // Verwachte parameters:
        // deviceId: String,
        // name: String,

        // Create player.
        let player = new players({
            deviceId: body.deviceId,
            name: body.name,
        });

        await players.findOne({ deviceId: body.deviceId })
            .then(async (foundPlayer) => {
                foundPlayer.name = body.name;
                await players.updateOne(foundPlayer);
                await foundPlayer.save().then((savedPlayer) => {
                    res.status(201).json(savedPlayer);
                })
                    .catch((err) => {
                        console.log(err.errors);
                        res.status(400).send(err.errors);
                    });
            })
            .catch((err) => {
                // Save player to database.
                player.save().then((savedPlayer) => {
                    res.status(201).json(savedPlayer);
                })
                    .catch((err) => {
                        console.log(err.errors);
                        res.status(400).send(err.errors);
                    });
            });
    });
}