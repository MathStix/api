//Imprt methods van AnswerUtils.
const { returnLetter, getLettersAndPosition } = require('../BuisnessLogic/answerUtils');

let answers = require('../models/answer');
const teams = require('../models/team');
const games = require('../models/game');
const exercises = require("../models/exercise");

module.exports = function (app) {

    //get all answers from one team.
    app.get('/getallanswers/:id', async (req, res) => {
        let id = req.params.id;
        // Verwachte parameters:
        // teamId: String,

        const foundAnswers = await answers.find({ teamId: id, });
        if (!foundAnswers) return res.status(404).send("Team not found");
        return res.status(200).json(foundAnswers);
    });

    //get one answer.
    app.get('/answer/:id', async (req, res) => {
        let id = req.params.id;
        // Verwachte parameters:
        // _id: String,

        const foundAnswer = await answers.find({ _id: id, });
        if (!foundAnswer) return res.status(404).send("Answer not found");
        return res.status(200).json(foundAnswer);
    });

    //Answer aanmaken.
    app.post('/answer', async (req, res) => {
        let body = req.body;
        // Verwachte parameters:
        // gameId: String,
        // teamId: Sting,
        // exerciseId: String,
        // teamId: String,
        // photos: String,
        // canvas: String

        // Create answer.
        let answer = new answers({
            texts: body.texts,
            exerciseId: body.exerciseId,
            teamId: body.teamId,
            photos: body.photos,
            canvas: body.canvas,
        });

        let guessedLetters = [];
        const foundExercise = await exercises.findOne({ _id: body.exerciseId, });
        if (!foundExercise) return res.status(404).send("exercise not found");

        if (body.texts[0] === foundExercise.answer) {
            const foundGame = await games.findOne({ _id: body.gameId, }).populate('teamIds');
            const foundTeam = await teams.findOne({ _id: body.teamId, });

            let letterPosition = returnLetter(foundTeam.guessedLetters, foundGame.word.length);
            foundTeam.guessedLetters.push(letterPosition);

            //letter opslaan in team.
            foundTeam.save().catch((err) => {
                return res.status(400).send(err.errors);
            });

            guessedLetters = getLettersAndPosition(foundGame.word, foundTeam.guessedLetters);

            if (!foundTeam || !foundGame) return res.status(404).send("Team or game not found");

            //alle deviceIds ophalen.
            let deviceIds = [];
            foundGame.teamIds.forEach(team => {
                team.playerIds.forEach(player => {
                    if (player.deviceId) {
                        deviceIds.push(player.deviceId);
                    }
                });
            });

            //websocket aanroepen om naar alle gebruikers te sturen dat er een antwoord goed was.
            var obj = {
                type: 'event',
                eventName: 'correctAnswer',
                clients: deviceIds,
                message: guessedLetters
            };
            app.eventEmit(JSON.stringify(obj));

            res.status(200).send(guessedLetters);
        } else {
            res.status(400).send("wrong guess");
        }

        //Save answer to database.
        answer.save().catch((err) => {
            return res.status(400).send(err.errors);
        });;
    });
}