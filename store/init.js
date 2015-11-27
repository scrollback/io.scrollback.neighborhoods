import core from "../store/core";
import GCM from "../push-notification/gcm";
import Analytics from "../analytics/analytics";

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
