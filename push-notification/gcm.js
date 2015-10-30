import React from "react-native";
import PushNotification from "../modules/push-notification";
import BuildConfig from "../modules/build-config";
import core from "../store/core";
import config from "../store/config";
import userUtils from "../lib/user-utils";

const {
	AsyncStorage,
	Platform
} = React;

const GCM_TIME_VALIDITY = 12 * 60 * 60 * 1000;
const KEY_REGISTER_TIME = "push_notification_gcm_register_time";

function registerGCM(userObj, registerTime) {
	if (Date.now() - (parseInt(registerTime, 10) || 0) > GCM_TIME_VALIDITY) {
		PushNotification.registerGCM(result => {
			if (result.type !== "success") {
				return;
			}

			const user = Object.assign({}, userObj);

			const params = user.params ? Object.assign({}, user.params) : {};
			const pushNotifications = params.pushNotifications ? Object.assign({}, params.pushNotifications) : {};
			const devices = pushNotifications.devices ? Object.assign({}, pushNotifications.devices) : {};

			devices[result.uuid + "_" + result.packageName] = {
				model: result.deviceModel,
				regId: result.registrationId,
				uuid: result.uuid,
				packageName: BuildConfig.APPLICATION_ID,
				expiryTime: Date.now() + GCM_TIME_VALIDITY,
				platform: Platform.OS,
				enabled: true
			};

			pushNotifications.devices = devices;
			params.pushNotifications = pushNotifications;
			user.params = params;

			core.emit("user-up", {
				to: user.id,
				user
			}, () => {
				AsyncStorage.setItem(KEY_REGISTER_TIME, Date.now().toString());
			});
		});
	}
}

function initialize() {
	PushNotification.setGCMSenderID(config.gcm.sender_id);

	core.on("init-dn", init => {
		const userObj = init.user;

		if (!userUtils.isGuest(userObj.id)) {
			AsyncStorage.getItem(KEY_REGISTER_TIME)
				.then(registerTime => registerGCM(userObj, registerTime))
				.catch(() => registerGCM(userObj));
		}
	});

	core.on("logout", () => {
		PushNotification.unRegisterGCM(() => {});
		AsyncStorage.removeItem(KEY_REGISTER_TIME);
	});
}

export default { initialize };
