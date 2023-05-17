let players = require('../models/player');

module.exports = function (app) {

    //Player aanmaken.
    app.post('/player', async (req, res) => {
        // Get body from request
        let body = req.body;

        // Create player.
        let player = new players({
            deviceId: body.deviceId,
            name: body.name,
        });

        // Save player to database.
        player.save().then((savedPlayer) => {
            res.status(201).json(savedPlayer);
        })
            .catch((err) => {
                console.log(err.errors);
                res.status(400).send(err.errors);
            });
    });
}