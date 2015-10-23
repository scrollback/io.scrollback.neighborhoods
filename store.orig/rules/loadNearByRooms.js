import geolocation from "../../modules/geolocation";

export default function(core) {
	function loadNearByRooms(position, memberOf) {
		const limit = memberOf.length ? null : 10;

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
			geolocation.getCurrentPosition(position => {
				if (position && position.coords) {
					loadNearByRooms(position, memberOf);
				} else {
					// Watch for position change
					watchID = geolocation.watchPosition(p => {
						if (p) {
							loadNearByRooms(p, memberOf);

							geolocation.clearWatch(watchID);
						}
					});
				}
			});
		}
	}, 1);
}
