const enmap = require("enmap");
const fs = require("fs");
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const packets = new enmap();

fs.readdir(__dirname + "/packets", (err, files) => {
    if (err) return console.error(err);
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(__dirname + "/packets/" + file);
        let packetType = file.split(".")[0];
        console.log(`🫡 Attempting to load packet with type: ${packetType}`);
        packets.set(packetType, props);
    });
});

module.exports = function (app) {
    app.eventEmit = (data) => {
        var obj = JSON.parse(data);
        eventEmitter.emit(obj.eventName, data);
    }

    app.getUniqueID = () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4();
    };

    app.ws("/websocket", (ws) => {
        // Load all packets

        ws.on('open', function open() {
            ws.send('something');
        });

        eventEmitter.on('startGame', (data) => {
            ws.send(data);
        });

        ws.on("message", (msg) => {
            // Get client info
            let bodyJson = JSON.parse(msg);

            // Device ID checking....

            const type = bodyJson.type;
            const foundPacket = packets.get(type);
            if (!foundPacket) return console.log(`🚫 Packet with type ${type} not found!`);
            foundPacket.handlePacket(ws, bodyJson);

            console.log(bodyJson);
        });
    });
};