let answers = require('../models/answer');

module.exports = function (app) {

    //Answer aanmaken.
    app.post('/answer', async (req, res) => {
        // Get body from request.
        let body = req.body;

        // Create answer.
        let answer = new answers({
            texts: body.text,
            exerciseId: body.exerciseId,
            teamId: body.teamId,
            photos: body.photos,
            canvas: body.canvas,
        });

        // Save answer to database.
        answer.save().then((savedAnswer) => {
            res.status(201).json(savedAnswer);
        })
            .catch((err) => {
                if (err.code === 11000) {
                    return res.status(400).send("Email already exists");
                }
                console.log(err.errors);
                res.status(400).send(err.errors);
            });
    });
}