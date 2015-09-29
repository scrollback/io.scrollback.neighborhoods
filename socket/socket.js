var eio = require("../../lib/socket"),
generate =require("../lib/generate.browser.js"),
userUtils = require("../lib/user-utils.js"),
objectUtils = require("../lib/object-utils.js"),
pending = require("../lib/pendingQueries.js");

var config, core, socket, store, backOff = 1, pendingQueries = {}, pendingActions = {}, session, queue = [], initDone = false, actionQueue = [];

/*
    {
        keygenerated: [
            {
                queryObject: {},
                next: callback for the next listener.
            },
            .
            .
            .,
            {
                queryObject: {},
                next: callback for the next listener.
            }
        ]
    }
*/


function onOpen() {
    backOff = 1;
    socket.on('message', onMessage);
    socket.on('close', onClose);
    core.emit("setstate", {app:{connectionStatus: "online"});
}

function onClose() {
    socket = null;
    core.emit("setstate", {
        app: { connectionStatus: "offline", reconnectingIn: backOff }
    }, function(err) {
        if (err) console.log(err.message);
    });
    setTimeout(connect, backOff * 1000);

    if (backOff <= 256) {
        backOff *= 2;
    }
}

function onMessage() {
    var data, note, userId;

    try {
        data = JSON.parse(event.data);
    } catch (err) {
        core.emit("error", err);
    }

    if (["getTexts", "getThreads", "getUsers", "getRooms", "getSessions", "getEntities", "upload/getPolicy", "getNotes", "error"].indexOf(data.type) !== -1) {
        if (pendingQueries[data.id]) {
            if (data.results) { pendingQueries[data.id].query.results = data.results; }
            if (data.response) { pendingQueries[data.id].query.response = data.response; }

            if (data.type === "error") {
                pendingQueries[data.id](data);
            } else {
                pendingQueries[data.id]();
            }

            delete pendingQueries[data.id];
        }
    }

    if (["text", "edit", "back", "away", "join", "part", "admit", "expel", "user", "room", "init", "note", "error"].indexOf(data.type) !== -1) {
        //data is an action
        if (pendingActions[data.id]) {
            pendingActions[data.id](data);
            delete pendingActions[data.id];
        }

        // Generate notifications from the action
        userId = store.get("user");

        if (data.note && data.from !== userId) {
            for (var n in data.note) {
                if (data.note[n]) {
                    note = data.note[n];

                    if (typeof note.score !== "number") {
                        note.score = 0;
                    }

                    note.to = userId;
                    note.ref = data.id;
                    note.time = data.time;
                    note.noteType = n;

                    core.emit("note-dn", note);
                }
            }
        }

//      console.log(data.type+ "-dn", data);
        core.emit(data.type + "-dn", data);
    }
}



function connect {
    if (!navigator.onLine) return onClose()();
    if(socket) return;

    socket = eio.Socket("ws://localhost:7528", { jsonp: createElement in document });
    socket.on('open', onOpen());


}


function sendAction(action) {
    action.session = session;
    action.from = store.get("user");
    socket.send(JSON.stringify(action));
}

function sendQuery(query, next) {
    var queryState ;
    queryState = store.getPendingQueryState(query);
    query.session = session;
    query.from = store.get("user");

    socket.send(JSON.stringify(query));

    pendingQueries[query.id] = next;
    pendingQueries[query.id].query = query;

    core.emit("setState", queryState);
}

function sendInit() {
    core.emit("init-up", { id: generate.uid(), resource: generate.uid() });
}

module.exports = function(c, conf, st) {
    core = c;
    config = conf;
    store = st;

    connect();

    core.on("init-up", function(init, next) {
        if (!init.session) session = init.session = "web://" + generate.uid();
        else session = init.session;
        init.type = "init";
        init.to = "me";
        socket.send(JSON.stringify(init));

        pendingActions[init.id] = function(action) {
            if (action.type === "init") {
                initDone = true;
                while (queue.length) {
                    queue.splice(0, 1)[0]();
                }
                core.emit("setstate", {
                    app: {
                        connectionStatus: "online"
                    },
                    user: action.user.id
                });
            }
        };
        next();
    }, 1);

    [ "getTexts", "getUsers", "getRooms", "getThreads", "getEntities", "upload/getPolicy", "getNotes" ].forEach(function(e) {
        core.on(e, function(q, n) {
            q.type = e;
            var key = pending.generateKey(q);

            if (currentQueries[key]) {
                currentQueries[key].push({
                    query:q,
                    next: n
                });

                return;
            }

            function finishQuery(err) {
                currentQueries[key].forEach(function(item, i) {
                    /*
                        When multiple queries have been aggregated, clones of the object
                        need to be sent as results to avoid the callbacks interfering with
                        each other by manipulating the same results objects.*/
                    item.query.results = (i === currentQueries.length - 1 ? q.results : objUtils.clone(q.results));
                    item.next(err);
                });
                delete currentQueries[key];
            }

            currentQueries[key] = [{
                query:q,
                next: n
            }];

            if (initDone) {
                sendQuery(q, finishQuery);
            } else {
                queue.push(function() {
                    sendQuery(q, finishQuery);
                });
            }

        }, 501);

        core.on("statechange", function(changes, next) {
            if (changes.app && changes.app.connectionStatus === "online") {
                initDone = true;
                while (queue.length) {
                    queue.splice(0, 1)[0]();
                }
            }
            next();
        }, 1000);

        core.on("user-up", function(userUp, next) {
            if (userUtils.isGuest(userUp.user.id)) {
                next();
                core.emit("user-dn", userUp);
            } else {
                userUp.type = "user";
                if (initDone) {
                    sendAction(userUp);
                } else {
                    actionQueue.push(function() {
                        sendAction(userUp);
                    });
                }
                next();
            }
        }, 1);

        [
            "text-up", "edit-up", "back-up", "away-up",
            "join-up", "part-up", "admit-up", "expel-up",
            "room-up", "note-up"
        ].forEach(function(event) {
            core.on(event, function(action, next) {
                action.type = event.replace(/-up$/, "");
                if (initDone) {
                    sendAction(action);
                } else {
                    actionQueue.push(function() {
                        sendAction(action);
                    });
    h            }
                next();
            }, 1);
        });
    });
};

window.addEventListener("offline", onClose());
window.addEventListener("online", connect);
