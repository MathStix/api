const mongoose = require("mongoose");
const express = require('express');
const app = express();
const websocket = require("express-ws")(app);
const bodyParser = require('body-parser');

require("dotenv").config();

mongoose.set('strictQuery', false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function init() {
    console.log("⏳ Connecting to DB...")
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ DB loaded!")

    app.listen(process.env.PORT || 3000, () => {
        console.log(`App is listening on port ${process.env.PORT || 3000}`);
    });

    require("./controllers/teacherController")(app);
    require("./controllers/exerciseController")(app);
    require("./controllers/courseController")(app);
    require("./controllers/gameController")(app);
    require("./controllers/teamController")(app);  
    require("./controllers/websocketController")(app);
}

init()