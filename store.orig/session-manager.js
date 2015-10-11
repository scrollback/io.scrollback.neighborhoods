/* eslint-env browser */
import { AsyncStorage } from "react-native";

module.exports = function(core) {
	let key;

	core.on("boot", changes => {
		var context = changes.context,
			host = "";

		if (context && context.env === "embed" && context.init && changes.context.init.jws) {
			host = context.origin && context.origin.host;
		}

		key = (host ? host + "_" : "") + "session";
	}, 700);

	core.on("init-up", (initUp, next) => {
		AsyncStorage.getItem(key)
			.then(value => {
				initUp.session = value;
				next();
			})
			.catch(next)
			.done();
	}, 999);

	core.on("init-dn", initDn => AsyncStorage.setItem(key, initDn.session).done(), 999);

	core.on("logout", () => AsyncStorage.removeItem(key).done(), 1000);
};
