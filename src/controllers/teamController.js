const { splitArray, rearangeArray, setUnlockedExerciseIdsOnTeamCreation } = require('../BuisnessLogic/TeamUtils');
const teams = require('../models/team');

//random name generator
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
const shortName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
    length: 2
});


module.exports = function (app) {


    app.post("/team", async (req, res) => {
        let body = req.body;

        //game voorbeeld.
        let playersinGame = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        let totalExerciseIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

        //array door elkaar husselen.
        playersinGame = rearangeArray(playersinGame)

        //teams indelen aan de hand van meegegeven "playersPerteam".
        const devidedTeams = splitArray(playersinGame, await body.playersPerTeam);

        //unlocked aantal exercises ophalen.
        const devidedExercises = rearangeArray(totalExerciseIds);
        const unlockedExerciseIds = setUnlockedExerciseIdsOnTeamCreation(devidedExercises);

        //game opdelen in teams.
        devidedTeams.forEach(async (element) => {

            let team = new teams({
                name: shortName,
                playerIds: element,
                unlockedExerciseIds: unlockedExerciseIds,
            });

            console.log(team);

            //!!! nog doen !!!

            //huidige game ophalen
            //team opslaan in een game

            //!!! nog doen !!!

            // await team.save().then( () => {
            //     res.status(201).json("team created");
            // }).catch((err) => {
            //     res.status(400).send(err.errors);
            // });
        });

        res.status(201).json("team created");
    });

}