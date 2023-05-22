//Imprt methods van TeamUtils.
const { splitArray, rearangeArray, setUnlockedExerciseIdsOnTeamCreation, GuessWord } = require('../BuisnessLogic/TeamUtils');

//random name generator.
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const teams = require('../models/team');
const games = require('../models/game');
const courses = require("../models/course");


module.exports = function (app) {

    //teams genereren aan de hand van een game met spelers en een course met exercises.
    app.post("/team", async (req, res) => {
        let body = req.body;
        // Verwachte parameters:
        // gameId: String,
        // playersPerTeam: Number,

        let currentGame = [];
        let currentCourse = [];

        //huidige Game ophalen.
        await games.findOne({ _id: body.gameId })
            .then((foundGame) => {

                //als de game al teams heeft, remove alle teams zodat er nieuwe kunnen worden aangemaakt.
                if (foundGame.teamIds || foundGame.teamIds.length > 0) {
                    //huidige teams verwijderen uit teams column.
                    foundGame.teamIds.forEach(async (team) => {
                        await teams.findByIdAndDelete(team._id)
                    });

                    //teams uit game verwijderen.
                    foundGame.teamIds = [];
                }
                currentGame = foundGame;
            });

        //huidige Course ophalen.
        await courses.findOne({ _id: currentGame.courseId })
            .then((foundCourse) => {
                currentCourse = foundCourse;
            });

        //players in Game.
        let playersinGame = currentGame.playerIds;

        //array door elkaar husselen.
        playersinGame = rearangeArray(playersinGame);

        //teams indelen aan de hand van meegegeven "playersPerteam".
        const devidedTeams = splitArray(playersinGame, body.playersPerTeam);

        if (!devidedTeams || devidedTeams.length == 0) { res.status(400).send("Not enough players"); }
        else {
            //game opdelen in teams.
            devidedTeams.forEach(async (players) => {
                //random name generator
                const shortName = uniqueNamesGenerator({
                    dictionaries: [adjectives, animals, colors],
                    length: 2
                });
                //unlocked aantal exercises ophalen.
                const devidedExercises = rearangeArray(currentCourse.exercises);
                const unlockedExerciseIds = setUnlockedExerciseIdsOnTeamCreation(devidedExercises);

                let team = new teams({
                    name: shortName,
                    playerIds: players,
                    unlockedExerciseIds: unlockedExerciseIds,
                });
                currentGame.teamIds.push(team._id);

                //team opslaan.
                await team.save();
            });

            //teams toevoegen aan Game.
            if (!currentGame.teamIds || currentGame.teamIds.length > 0) {
                await currentGame.save().then(() => {
                    res.status(201).json("teams saved");
                }).catch((err) => {
                    res.status(400).send(err.errors);
                });
            }
            else {
                res.status(400).send("No teams");
            }
        }
    });


    //Speler naar een ander team verplaatsen.
    app.post("/moveplayer", async (req, res) => {
        let body = req.body;
        // Verwachte parameters:
        // newTeamId: String,
        // oldTeamId: String,
        // playerId: String,

        teams
            .findOne({ _id: body.newTeamId })
            .then(async (foundTeam) => {

                foundTeam.playerIds.push(body.playerId)

                await foundTeam.save();

                //player verwijderen uit huidige team.
                teams
                    .findOne({ _id: body.oldTeamId })
                    .then(async (foundTeam) => {
                        foundTeam.playerIds.splice(foundTeam.playerIds.indexOf(body.playerId), 1);

                        await foundTeam.save();
                    });

                res.status(200).json("Player moved");
            })
            .catch((err) => {
                console.log(err);
                res.status(404).send("Team not found");
            });
    });


    //woord van de game gokken.
    app.post("/guessword", async (req, res) => {
        let body = req.body;
        // Verwachte parameters:
        // gameId: String,
        // teamId: String,

        //woord nog ophalen uit game.
        const word = 'wiskunde';
        const now = new Date();
        let currentTeam = [];

        await teams
            .findOne({ _id: body.teamId })
            .then(async (foundTeam) => {

                currentTeam = foundTeam;
            })

        //check of het team alweer mag raden ivm de timepenalty.
        if (new Date(now.getTime()) > new Date(currentTeam.guessCooldown) || currentTeam.guessCooldown === undefined) {
            const includingLetters = GuessWord(word, body.guessWord);

            //check of het gegokte woord overeenkomt met het game woord.
            if (word !== body.guessWord) {

                //elke foute guess telt 3 minuten straftijd erbij op en krijgt een guess cooldown van 4 minuten.
                if (currentTeam.timePenalty === undefined) { currentTeam.timePenalty = 3; }
                else { currentTeam.timePenalty += 3; }

                const guessCooldown = new Date(now.getTime() + 4 * 60000);
                currentTeam.guessCooldown = guessCooldown.toString();

                await currentTeam.save();

                res.status(204).json(includingLetters);
            }
            else {
                //team heeft woord geraden, nog wat voor verzinnen.
                res.status(200).json(includingLetters);
            }
        }
        else {
            res.status(400).json("Wait out timepenalty");
        }
    });

}