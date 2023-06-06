let courses = require("../models/course");

module.exports = function (app) {

  //Course ophalen aan courseId.
  app.get("/course/:id", async (req, res) => {
    let id = req.params.id;
    // Verwachte parameters:
    // _id: String,

    const foundCourse = await courses.findById(id).populate("exercises");
    if (!foundCourse) return res.status(404).send("Course not found");
    return res.status(200).json(foundCourse);

  });

  //Alle Courses van een teacher ophalen met teacherID.
  app.get("/getallcourses/:id", async (req, res) => {
    let id = req.params.id;
    // Verwachte parameters:
    // teacherId: String,

    const foundCourses = await courses.find({ teacherId: id, }).populate("exercises");
    if (!foundCourses) return res.status(404).send("Course not found");
    return res.status(200).json(foundCourses);

  });

  //Course aanmaken.
  app.post("/course", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // title: String,
    // description: String,
    // teacherId: String,

    //Create course
    let course = new courses({
      title: body.title,
      description: body.description,
      teacherId: body.teacherId,
    });

    //Save course to database
    await course.save().then((savedCourse) => {
      res.status(201).json(savedCourse);
    }).catch((err) => {
      res.status(400).send(err.errors);
    });
  });

  //Course verwijderen.
  app.delete("/course", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,

    courses
      .findOne({ _id: body._id })
      .then((foundCourse) => {
        // Remove course from database
        courses
          .findByIdAndDelete(foundCourse._id)
          .then((deletedCourse) => {
            return res.status(200).send("Course removed");
          }).catch((err) => {
            return res.status(400).send(err);
          });
      }).catch((err) => {
        console.log(err);
        res.status(404).send("Course not found");
      });
  });

  //Course updaten.
  app.put("/course", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,
    // title: String,
    // description: String,

    courses
      .findOne({ _id: body._id })
      .then(async (foundCourse) => {
        if (body.title) foundCourse.title = body.title;
        if (body.description) foundCourse.description = body.description;

        await courses.updateOne(foundCourse);
        await foundCourse.save();

        res.status(201).json("Course updated");
      }).catch((err) => {
        console.log(err);
        res.status(404).send("Course not found");
      });
  });

  //Exercise toevoegen aan course.
  app.post("/addexercise", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,
    // exerciseId: String,

    courses
      .findOne({ _id: body._id })
      .then(async (foundCourse) => {

        foundCourse.exercises.push(body.exerciseId)

        await foundCourse.save();

        res.status(201).json("Exercise added");
      }).catch((err) => {
        console.log(err);
        res.status(404).send("Course not found");
      });
  });

  //Exercise verwijderen uit course.
  app.post("/removeexercise", async (req, res) => {
    let body = req.body;
    // Verwachte parameters:
    // _id: String,
    // exerciseId: String,

    courses
      .findOne({ _id: body._id })
      .then(async (foundCourse) => {
        foundCourse.exercises.splice(foundCourse.exercises.indexOf(body.exerciseId), 1);

        await foundCourse.save();

        res.status(201).json("Exercise removed");
      }).catch((err) => {
        console.log(err);
        res.status(404).send("Course not found");
      });
  });

};