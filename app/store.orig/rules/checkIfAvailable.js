import React from "react-native";
import Geolocation from "../../modules/Geolocation";
import userUtils from "../../lib/user-utils";

const GPS_ENABLE_MESSAGE = "Help us find the best communities for you by enabling your GPS.";
const GPS_ENABLE_OK = "Go to settings";
const GPS_ENABLE_CANCEL = "Not now";

const {
	Alert
} = React;

module.exports = function(core) {
	function checkIfAvailable(position) {
		core.emit("getRooms", {
			location: {
				lat: position.coords.latitude,
				lon: position.coords.longitude
			},
			limit: 1
		}, (err, res) => {
			if (err) {
				return;
			}

			if (!(res.results && res.results.length)) {
				core.emit("setstate", {
					app: {
						isAvailable: false
					}
				});
			}
		});
	}

	core.on("init-dn", async init => {
		if (userUtils.isGuest(init.user.id)) {
			return;
		}

		if (init.memberOf.length < 1) {
			core.emit("setstate", {
				app: {
					nearByRooms: [ "missing" ]
				}
			});

			try {
				// Get current position
				const position = await Geolocation.getCurrentPosition();

				checkIfAvailable(position);
			} catch (e) {
				// Watch for position change
				const watchID = Geolocation.watchPosition(p => {
					if (p) {
						checkIfAvailable(p);
						Geolocation.clearWatch(watchID);
					}
				});

				// Request to enable GPS
				const isEnabled = await Geolocation.isGPSEnabled();

				if (!isEnabled) {
					Alert.alert(
						null, GPS_ENABLE_MESSAGE,
						[
							{ text: GPS_ENABLE_CANCEL },
							{
								text: GPS_ENABLE_OK,
								onPress: () => Geolocation.showGPSSettings()
							},
						]
					);
				}
			}
		}
	}, 1);
};
