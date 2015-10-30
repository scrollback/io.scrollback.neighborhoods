import { NativeModules } from "react-native";

const { PushNotificationModule } = NativeModules;

export default {
	setGCMSenderID(id) {
		PushNotificationModule.setGCMSenderID(id);
	},

	registerGCM() {
		return new Promise((resolve, reject) => {
			PushNotificationModule.registerGCM(result => {
				if (result.type === "success") {
					resolve(result);
				} else {
					reject(new Error(result.message));
				}
			});
		});
	},

	unRegisterGCM() {
		return new Promise((resolve, reject) => {
			PushNotificationModule.unRegisterGCM(result => {
				if (result.type === "success") {
					resolve(result);
				} else {
					reject(new Error(result.message));
				}
			});
		});
	},

	setPreference(key, value) {
		PushNotificationModule.setPreference(key, value);
	},

	getPreference(key) {
		return new Promise(resolve => PushNotificationModule.getPreference(key, resolve));
	}
};
