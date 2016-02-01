/* @flow */

import core from "../../store/core";
import store from "../../store/store";
import { dispatch } from "../../store/actions";

function initialize() {
	core.on("user-dn", async action => {
		const roomsFollowing = store.getRelatedRooms().filter(rel => rel.role === "follower").map(rel => rel.id);

		const places = action.user.params && action.user.params.places ? action.user.params.places : [];
		const rooms = places.filter(it => it.type !== "state").map(it => it.id);
		const states = places.filter(it => it.type === "state").map(it => it.id);

		const parentRooms = rooms
			.map(id => {
				const room = store.getRoom(id);

				return room && room.guides ? room.guides.alsoAutoFollow : null;
			})
			.filter((it, i, self) => it && self.indexOf(it) === i);

		const roomsToProcess = rooms.slice().concat(parentRooms);
		const statesToProcess = states.length ? parentRooms.map(room => states[0] + "-in-" + room) : [];

		const roomsSaved = [ ...roomsToProcess, ...statesToProcess ];
		const roomsShouldFollow = roomsSaved.filter(room => roomsFollowing.indexOf(room) === -1);
		const roomsShouldLeave = roomsFollowing.filter(room => roomsSaved.indexOf(room) === -1);

		try {
			await Promise.all([].concat(
				roomsShouldFollow.map(room => dispatch("join", { to: room })),
				roomsShouldLeave.map(room => dispatch("part", { to: room }))
			));
		} catch (e) {
			// ignore
		}
	});
}

export default { initialize };
