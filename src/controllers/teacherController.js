let teachers = require('../models/teacher');

module.exports = function (app) {

    app.get("/teacher/:id", async (req, res) => {
        let id = req.params.id;
        // Verwachte parameters:
        // _id: String,

        teachers.findById(id).then((foundTeacher) => {
            res.status(200).json(foundTeacher);
        }).catch((err) => {
            console.log(err);
            res.status(404).send("Teacher not found");
        });
    });

    //Teacher aanmaken/registreren.
    app.post('/teacher', async (req, res) => {
        let body = req.body;
        // Verwachte parameters:
        // fullName: String,
        //  email: String,
        //  password: String,

        // Create teacher 
        let teacher = new teachers({
            fullName: body.fullName,
            email: body.email,
            password: body.password,
        });

        // Save teacher to database
        teacher.save().then((savedTeacher) => {
            res.status(201).json(savedTeacher);
        })
            .catch((err) => {
                if (err.code === 11000) {
                    return res.status(400).send("Email already exists");
                }
                console.log(err.errors);
                res.status(400).send(err.errors);
            });
    });

    //Inloggen
    app.post('/login', async (req, res) => {
        let body = req.body;
        // Verwachte parameters:
        //  email: String,
        //  password: String,

        teachers.findOne({ email: body.email }).then((foundTeacher) => {
            foundTeacher.comparePassword(body.password, function (err, isMatch) {
                if (err) {
                    console.log(err);
                    return res.status(400).send("Password incorrect");
                };
                res.status(200).send(isMatch ? "Password correct" : "Password incorrect");
            });
        }).catch((err) => {
            res.status(404).send("Email not found");
        });
    });

    //Teacher verwijderen
    app.delete('/teacher', async (req, res) => {
        let body = req.body;
        // Verwachte parameters:
        // _id: String,
        //  email: String,
        //  password: String,

        teachers.findOne({ email: body.email }).then((foundTeacher) => {
            foundTeacher.comparePassword(body.password, function (err, isMatch) {
                if (isMatch) {
                    // Remove teacher from database
                    teachers.findByIdAndDelete(foundTeacher._id).then((deletedTeacher) => {
                        return res.status(200).send("Teacher removed");
                    }).catch((err) => {
                        return res.status(400).send(err);
                    });;
                } else {
                    return res.status(400).send("Password incorrect");
                }
            });
        }).catch((err) => {
            res.status(404).send("Email not found");
        });
    })

    //Teacher updaten (fullname, email en wachtwoord los).
    app.put('/teacher', async (req, res) => {
        let body = req.body;
        // Verwachte parameters:
        // _id: String,
        //  fullName: String,
        //  email: String,
        //  password: String,

        teachers.findOne({ email: body.email }).then(async (foundTeacher) => {

            if (body.fullName) foundTeacher.fullName = body.fullName;
            if (body.email) foundTeacher.email = body.email;

            if (body.password && body.oldPassword) foundTeacher.comparePassword(body.oldPassword, function (err, isMatch) {
                if (isMatch) {
                    foundTeacher.password = body.password;
                }
            });

            await teachers.updateOne(foundTeacher);
            await foundTeacher.save();

            res.status(201).json("Teacher updated");

        }).catch((err) => {
            console.log(err)
            res.status(404).send("kontje not found");
        });
    })
}