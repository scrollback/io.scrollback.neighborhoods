var store, core, config, state;

function removeRelationProps(obj) {
    return obj;
}

function getRelationFromRelatedUser(relatedUser) {
    var relation = {};
    return relation;
}

function processUsers(query) {
    var newState  = {}, entities = {}, ref = query.occupantOf || query.memberOf || "", knowledge = {roomUsers: {}}, partitionKey = "";

    if (ref) {
        partitionKey = ref + (query.occupantOf ? "occupantOf" : "memberOf");
        knowledge.roomUsers[partitionKey] = [];
        newState.knowledge = knowledge;
    }
    results.forEach(function(user) {
        var relation;
        entities[user.id] = removeRelationProps(user);
        if(!query.ref && ref) {
            relation = getRelationFromRelatedUser(user, ref);
            entities[user.id+"_"+ ref] = relation;

        }
    });

    newState.entities = entities;
    return newState;
}


function processRooms(query) {
    var newState  = {}, entities = {}, ref = query.hasMember || query.hasOccupant || "", knowledge = {roomUsers: {}}, partitionKey = "";

    if (ref) {
        partitionKey = ref + (query.hasMember ? "hasMember" : "hasOccupant");
        knowledge.roomUsers[partitionKey] = [];
        newState.knowledge = knowledge;
    }

    results.forEach(function(room) {
        var relation;
        entities[room.id] = removeRelationProps(room);
        if(!query.ref && ref) {
            relation = getRelationFromRelatedUser(room, ref);
            entities[ref+"_"+ room.id] = relation;
        }
    });

    newState.entities = entities;
    return newState;
}


function processContent(query) {
    var newState = {entities:{}}, partitionKey, knowledge = {}, ranges = {};
    partitionKey = store.getPartitionKey(query);
    ranges.time = query.time;
    range.end = query.before ? -query.before : query.after;
    knowledge[partitionKey] = [range];

    query.results.forEach(function(threads) {
        newState.entities[text.id] = threads;
    });

    newState.knowledge = knowledge;
    return newState
}


module.exports = function(sto, c, conf, st) {
    store = sto;
    core = c;
    config = conf;
    state = st;
    core.on("getTexts", function(query, next) {
        if(!query.results) return next();
        core.emit("setstate", processContent(query));
    }, 100);

    core.on("getThreads", function(query, next) {
        if(!query.results) return next();
        core.emit("setstate", processContent(query));
    }, 100);

    core.on("getUsers", function(query, next) {
        if(!query.results) return next();
        core.emit("setstate", processUsers(query));
    }, 100);

    core.on("getRooms", function(query, next) {
        if(!query.results) return next();
        core.emit("setstate", processRooms(query));
    }, 100);



     core.on("getUsers", function(query, next) {
        var wait = true, isErr = false;
        if(!query.relatedTo) return next();

        function done(err, q) {
            if(isErr) return;
            if(err) {
                isErr = true;
                return next(err);
            } else if(!wait) {
                return next();
            }
            wait = false;
        }

        core.emit("getUsers", {memberOf: query.relatedTo}, done);
        core.emit("getUsers", {occupantOf: query.relatedTo}, done);
    }, 900);


     core.on("getRooms", function(query, next) {
        var wait = true, isErr = false;
        if(!query.relatedTo) return next();

        function done(err, q) {
            if(isErr) return;
            if(err) {
                isErr = true;
                return next(err);
            } else if(!wait) {
                return next();
            }
            wait = false;
        }

        core.emit("getRooms", {hasOccupant: query.relatedTo}, done);
        core.emit("getRooms", {hasMember: query.relatedTo}, done);
    }, 900);
};
