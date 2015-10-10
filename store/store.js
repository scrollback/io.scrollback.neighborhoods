import core from "./core";
import config from "./config";
import WebSocket from "../modules/websocket";

global.WebSocket = WebSocket;

export default require("../store.orig/store")(core, config);
