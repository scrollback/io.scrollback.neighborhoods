import core from "./core";
import config from "./config";
import init from "./init";
import WebSocket from "../modules/websocket";
import GCM from "../push-notification/gcm";

require("babel/polyfill");

global.WebSocket = WebSocket;
global.navigator.userAgent = "react-native";

const store = require("../store.orig/store")(core, config);

global.sb = core;
global.store = store;

GCM.initialize();

init();

export default store;
