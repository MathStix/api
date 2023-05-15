const enmap = require("enmap");
const fs = require("fs");

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
  app.ws("/websocket", (ws) => {
    // Load all packets

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
