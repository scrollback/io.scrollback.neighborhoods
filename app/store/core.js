import Ebus from "ebus";
import config from "./config";

export default new Ebus(config.appPriorities);
