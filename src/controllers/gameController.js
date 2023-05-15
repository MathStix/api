const games = require('../models/game');

module.exports = function (app) {
    app.post("/game", async (req, res) => {
        let body = req.body;

        let game = new games({
            courseId: body.courseId,
        });

        await game.save().then((savedGame) => {
            res.status(201).json(savedGame);
        }).catch((err) => {
            res.status(400).send(err.errors);
        });
    });
}