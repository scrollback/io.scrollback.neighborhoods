import React from 'react-native';
import PushNotification from '../../modules/PushNotification';
import BuildConfig from '../../modules/BuildConfig';
import core from '../../store/core';
import config from '../../store/config';
import userUtils from '../../lib/user-utils';

const {
	AsyncStorage,
	Platform
} = React;

const GCM_TIME_VALIDITY = 12 * 60 * 60 * 1000;
const KEY_REGISTER_TIME = 'push_notification_gcm_register_time';

async function registerGCM(userObj, registerTime) {
	if (Date.now() - (parseInt(registerTime, 10) || 0) > GCM_TIME_VALIDITY) {
		try {
			const result = await PushNotification.registerGCM();

			const user = Object.assign({}, userObj);

			const params = user.params ? Object.assign({}, user.params) : {};
			const pushNotifications = params.pushNotifications ? Object.assign({}, params.pushNotifications) : {};
			const devices = pushNotifications.devices ? Object.assign({}, pushNotifications.devices) : {};

			devices[result.uuid + '_' + BuildConfig.APPLICATION_ID] = {
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

			core.emit('user-up', {
				to: user.id,
				user
			}, () => {
				AsyncStorage.setItem(KEY_REGISTER_TIME, Date.now().toString());
			});
		} catch (e) {
			// Ignore
		}
	}
}

function initialize() {
	PushNotification.setGCMSenderID(config.gcm.sender_id);

	core.on('init-dn', async init => {
		const userObj = init.user;

		if (!userUtils.isGuest(userObj.id)) {
			try {
				const registerTime = await AsyncStorage.getItem(KEY_REGISTER_TIME);

				registerGCM(userObj, registerTime);
			} catch (e) {
				registerGCM(userObj);
			}
		}
	});

	core.on('logout', () => {
		PushNotification.unRegisterGCM();
		AsyncStorage.removeItem(KEY_REGISTER_TIME);
	});
}

export default { initialize };
