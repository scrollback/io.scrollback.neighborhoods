"use strict";

var engine = require("engine.io"),
    http = require("http").createServer().listen(8321),
    server = engine.attach(http),
    data = require("./data");

server.on("connection", function (socket) {
    console.log("Socket connected:", socket.id);

    socket.on("message", function(message) {
        var parsed;

        try {
            parsed = JSON.parse(message);
        } catch (e) {
            // do nothing
        }

        if (parsed && parsed.type === "get") {
            console.log("Sending data");

            socket.send(JSON.stringify({
                type: "data",
                data: data
            }));
        } else {
            console.log("Socket received:", message);
        }
    });
});

