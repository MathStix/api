//Imprt methods van TeamUtils.
const { splitArray, rearangeArray, setUnlockedExerciseIdsOnTeamCreation } = require('../BuisnessLogic/TeamUtils');

//random name generator.
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');

const teams = require('../models/team');
const games = require('../models/game');
const courses = require("../models/course");


module.exports = function (app) {

    app.post("/team", async (req, res) => {
        let body = req.body;

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

}