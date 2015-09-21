/* eslint-env browser */

import WebSocket from "../modules/websocket";

window.WebSocket = WebSocket;
window.navigator.userAgent = "react-native";

const io = require("socket.io-client/socket.io");

export default io("ws://localhost:8321", { jsonp: false });
