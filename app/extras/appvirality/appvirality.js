import { AsyncStorage } from "react-native";
import Appvirality from "../../modules/appvirality";
import userUtils from "../../lib/user-utils";
import core from "../../store/core";

const IS_EXISTING_KEY = "appvirality_user_is_existing";
const EVENT_LAUNCH = "Launch";
const EVENT_SIGNUP = "Signup";

function initialize() {
	let launchEvent;

	core.on("init-dn", async init => {
		const user = init.user;

		if (userUtils.isGuest(user.id)) {
			return;
		}

		const exists = await AsyncStorage.getItem(IS_EXISTING_KEY);
		const success = await Appvirality.setUserDetails({
			email: user.identities[0].slice(7),
			name: user.id,
			storeId: user.id,
			profileImage: user.picture,
			isExisting: exists === "1"
		});

		if (!success) {
			return;
		}

		if (exists !== "1") {
			AsyncStorage.setItem(IS_EXISTING_KEY, "1");
		}

		if (!launchEvent) {
			launchEvent = true;

			Appvirality.saveConversionEvent(EVENT_LAUNCH);
		}
	});

	core.on("user-dn", action => {
		if (action.user && !userUtils.isGuest(action.user.id) && action.old && userUtils.isGuest(action.old.id)) {
			Appvirality.saveConversionEvent(EVENT_SIGNUP);
		}
	});
}

export default {
	initialize
};
