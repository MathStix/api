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

    function sendDataToClients(data) {
        let bodyJson = JSON.parse(data);

        bodyJson.clients.forEach(function (element) {
            const client = clients.get(element.deviceId);

            if (client) {
                client.send(JSON.stringify({ teamId: element.teamId, message: bodyJson.message }));
            }
        });
    }

    // Store the connected clients
    const clients = new Map();

    app.ws("/websocket", (ws) => {
        // Load all packets

        //event om een game te starten sturen naar alle spelers.
        eventEmitter.on('startGame', (data) => {
            sendDataToClients(data);
        });

        //event om een antwoord naar elke client te sturen in een team.
        eventEmitter.on('correctAnswer', (data) => {
            sendDataToClients(data);
        });

        ws.on("message", (data) => {
            let bodyJson = JSON.parse(data);

            if (bodyJson.type === 'setClientId') {
                // Store the client in the map
                if (clients.has(bodyJson.deviceId)) {
                    clients.delete(bodyJson.deviceId);
                }

                clients.set(bodyJson.deviceId, ws);
                ws.send(JSON.stringify({ deviceId: bodyJson.deviceId }));
            }
            if (bodyJson.type === 'sendlocation') {
                clients.forEach(function each(client) {
                    client.send(JSON.stringify({ message: bodyJson.message }));
                });
            }
        });

        // ws.on("message", (msg) => {
        //     // Get client info
        //     let bodyJson = JSON.parse(msg);

        //     // Device ID checking....

        //     const type = bodyJson.type;
        //     const foundPacket = packets.get(type);
        //     if (!foundPacket) return console.log(`🚫 Packet with type ${type} not found!`);
        //     foundPacket.handlePacket(ws, bodyJson);

        //     console.log(bodyJson);
        // });
    });
};