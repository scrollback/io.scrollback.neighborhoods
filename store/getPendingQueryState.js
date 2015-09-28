var core, config, store;

var functions = {
    getTexts: function(store, query) {
        var room = query.to, thread = query.thread || "";
        var pending = store.get("pending", room+"/"+thread) || [];
        var result = false;

        for (i = 0; i < pending.length; i++) {
            result = isDuplicate(pending[i], query)
            if(result) break;
        }

        if() {

        }
    },
    getThreads: function(store, query) {

    }
};



module.exports = function(c, conf, st) {
    core = c;
    config = conf;
    store = st;

    return function (query) {
        var self = this;
        return functions[query.type](self, query);
    };
};
