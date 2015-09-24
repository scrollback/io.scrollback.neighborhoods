/* eslint-env browser */

import WebSocket from "../modules/websocket";

window.WebSocket = WebSocket;
window.navigator.userAgent = "react-native";

const eio = require("engine.io-client/engine.io");

export default new eio.Socket("ws://localhost:7528", { jsonp: false });
