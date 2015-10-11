import core from "./core";
import config from "./config";
import init from "../init/init";
import WebSocket from "../modules/websocket";

global.WebSocket = WebSocket;
global.navigator.userAgent = "react-native";

const store = require("../store.orig/store")(core, config);

global.core = core;
global.store = store;

init(core);

console.log(store.get());

export default store;
