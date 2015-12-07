import { NativeModules } from "react-native";
import RCTDeviceEventEmitter from "RCTDeviceEventEmitter";

const { GeolocationModule } = NativeModules;

const watchCallbacks = {};

let watchID = 0;

RCTDeviceEventEmitter.addListener("geolocationChange", ev => {
	for (const id in watchCallbacks) {
		watchCallbacks[id](ev);
	}
});

export default {
	getCurrentPosition() {
		return GeolocationModule.getCurrentPosition();
	},

	watchPosition(success) {
		GeolocationModule.startWatching();

		watchID++;

		watchCallbacks[watchID] = success;

		return watchID;
	},

	clearWatch(id) {
		delete watchCallbacks[id];

		if (Object.keys(watchCallbacks).length === 0) {
			GeolocationModule.stopWatching();
		}
	},

	isGPSEnabled() {
		return GeolocationModule.isGPSEnabled();
	},

	showGPSSettings() {
		GeolocationModule.showGPSSettings();
	}
};
