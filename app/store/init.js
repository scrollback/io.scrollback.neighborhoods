import core from "../store/core";
import GCM from "../extras/gcm/gcm";
import Analytics from "../extras/analytics/analytics";

let bootComplete = false;

export default function() {
	const newState = {};

	let initNext;

	if (!newState.app) {
		newState.app = {};
	}

	newState.app.connectionStatus = "connecting";

	core.emit("boot", newState, () => {
		newState.app.bootComplete = true;
		bootComplete = true;

		core.emit("setstate", newState);

		if (initNext) {
			initNext();
		}
	});

	core.on("init-up", (action, next) => {
		if (!bootComplete) {
			initNext = next;
		} else {
			next();
		}
	}, 1000);
}

GCM.initialize();
Analytics.initialize();
