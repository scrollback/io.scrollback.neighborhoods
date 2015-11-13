import core from "./core";
import config from "./config";
import init from "./init";
import WebSocket from "../modules/websocket";

require("babel/polyfill");

global.WebSocket = WebSocket;
global.navigator.userAgent = "react-native";

const store = require("../store.orig/store")(core, config);

global.sb = core;
global.store = store;

init();
export default store;
