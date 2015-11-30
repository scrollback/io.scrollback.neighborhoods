var merge = require("./merge-config.js");

var defaults = {
	server: {
		protocol: "https:",
		host: "heyneighbor.chat",
		apiHost: "heyneighbor.chat"
	},
	pushNotification: {
		defaultPackageName: "io.scrollback.neighborhoods"
	}
};

module.exports = (function() {
	var changes;

	try {
		changes = require("./client-config.js");
	} catch (e) {
		changes = {};
	}

	return merge(defaults, changes);
}());
