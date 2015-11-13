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
		return new Promise((resolve, reject) => {
			GeolocationModule.getCurrentPosition(position => {
				if (position && position.coords) {
					resolve(position);
				} else {
					reject(new Error("Failed to get current position"));
				}
			});
		});
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
		return new Promise(resolve => GeolocationModule.isGPSEnabled(resolve));
	},

	showGPSSettings() {
		GeolocationModule.showGPSSettings();
	}
};
