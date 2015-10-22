import core from "./core";
import config from "./config";
import init from "../init/init";
import WebSocket from "../modules/websocket";

global.WebSocket = WebSocket;
global.navigator.userAgent = "react-native";

const store = require("../store.orig/store")(core, config);

global.sb = core;
global.store = store;

require("babel/polyfill");

init(core);

export default store;
