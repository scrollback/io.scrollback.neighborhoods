import Alert from "../../modules/alert";
import Geolocation from "../../modules/geolocation";

const GPS_ENABLE_MESSAGE = "Help us find the best communities for you by enabling your GPS.";
const GPS_ENABLE_OK = "Go to settings";
const GPS_ENABLE_CANCEL = "Not now";

export default function(core) {
	function loadNearByRooms(position, memberOf) {
		const limit = memberOf.length ? 10 : null;

		core.emit("getRooms", {
			location: {
				lat: position.coords.latitude,
				lon: position.coords.longitude
			},
			limit
		}, (err, res) => {
			if (err) {
				core.emit("setstate", {
					app: {
						nearByRooms: []
					}
				});

				return;
			}

			if (res && res.results && res.results.length) {
				core.emit("setstate", {
					app: {
						nearByRooms: res.results.filter(room => !memberOf.includes(room.id))
					}
				});
			}
		});
	}

	core.on("init-dn", init => {
		const memberOf = init.memberOf.map(room => room.id);

		if (memberOf.length < 4) {
			core.emit("setstate", {
				app: {
					nearByRooms: [ "missing" ]
				}
			});

			let watchID;

			// Get current position
			Geolocation.getCurrentPosition(position => {
				if (position && position.coords) {
					loadNearByRooms(position, memberOf);
				} else {
					// Watch for position change
					watchID = Geolocation.watchPosition(p => {
						if (p) {
							loadNearByRooms(p, memberOf);

							Geolocation.clearWatch(watchID);
						}
					});

					// Request to enable GPS
					Geolocation.isGPSEnabled(value => {
						if (!value) {
							Alert.prompt(GPS_ENABLE_MESSAGE, [
								{
									text: GPS_ENABLE_OK,
									onPress: () => Geolocation.showGPSSettings()
								},
								{
									text: GPS_ENABLE_CANCEL,
									onPress: () => {
										core.emit("setstate", {
											app: {
												nearByRooms: []
											}
										});
									}
								}
							]);
						}
					});
				}
			});
		}
	}, 1);
}
