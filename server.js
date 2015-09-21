"use strict";

var io = require("socket.io").listen(8321),
    data = require("./data");

io.on("connection", function(socket) {
    console.log("Socket connected");

    socket.on("get", function() {
        console.log("Sending data");

        socket.emit("data", data);
    });
});
