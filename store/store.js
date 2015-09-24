
var Store =  require("./store-class.js");
var stateManager = require("./state-manager.js");

module.exports = function(core, config) {
    var state = {
        entities:{},
        indexes:{},
        knowledge:{},
        pending:{},
        recent:{}
        session: "",
        user: "",
        notes: [],
        context: {},
        app: {
            listeningRooms: [],
            connectionStatus: "connecting",
            connectingIn: 0
        }
    };

    var store = new Store(core, config, state);
    stateManager(core, config, state);
    return store;
};
