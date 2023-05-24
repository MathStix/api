let exercises = require("../models/exercise");

module.exports = function (app) {

    //Exercise ophalen aan exerciseId.
  app.get("/exercise", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,

    exercises.findOne({ _id: body._id })
      .then((foundExercise) => {
        res.status(200).json(foundExercise);
      });
  });


  //Alle exercises van een teacher ophalen met teacherID.
  app.get("/getallexercises", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // teacherId: String,

    exercises.find({ teacherId: body.teacherId })
      .then((foundExercises) => {
        res.status(200).json(foundExercises);
      });
  });


  //Exercise aanmaken.
  app.post("/exercise", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // title: String,
    // description: String,
    // answer: String,
    // location: String,
    // photo: String,
    // activationRange: String,
    // exerciseType: String,
    // teacherId: String,

    // Create exercise
    let exercise = new exercises({
      title: body.title,
      description: body.description,
      answer: body.answer,
      location: body.location,
      photo: body.photo,
      activationRange: body.activationRange,
      exerciseType: body.exerciseType,
      teacherId: body.teacherId
    });

    // Save exercise to database
    await exercise
      .save()
      .then((savedExercise) => {
        res.status(201).json(savedExercise);
      })
      .catch((err) => {
        res.status(400).send(err.errors);
      });
  });


  //Exercise verwijderen.
  app.delete("/exercise", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,

    exercises
      .findOne({ _id: body._id })
      .then((foundExercise) => {
        // Remove exercise from database
        exercises
          .findByIdAndDelete(foundExercise._id)
          .then((deletedExercise) => {
            return res.status(200).send("Exercise removed");
          })
          .catch((err) => {
            return res.status(400).send(err);
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send("Exercise not found");
      });
  });


  //exercise updaten.
  app.put("/exercise", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,
    // title: String,
    // description: String,
    // answer: String,
    // location: String,
    // photo: String,
    // activationRange: String,
    // exerciseType: String,

    exercises
      .findOne({ _id: body._id })
      .then(async (foundExercise) => {
        if (body.title) foundExercise.title = body.title;
        if (body.description) foundExercise.description = body.description;
        if (body.answer) foundExercise.answer = body.answer;
        if (body.location) foundExercise.location = body.location;
        if (body.photo) foundExercise.photo = body.photo;
        if (body.activationRange)
          foundExercise.activationRange = body.activationRange;
        if (body.exerciseType) foundExercise.exerciseType = body.exerciseType;

        await exercises.updateOne(foundExercise);
        await foundExercise.save();

        res.status(201).json("Exercise updated");
      })
      .catch((err) => {
        console.log(err);
        res.status(404).send("Exercise not found");
      });
  });
};
