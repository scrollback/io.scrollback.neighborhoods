/* @flow */

import compact from 'lodash/compact';
import difference from 'lodash/difference';
import core from '../../store/core';
import store from '../../store/store';
import { query, dispatch } from '../../store/actions';

function initialize() {
	core.on('user-dn', async action => {
		const roomsFollowing = store.getRelatedRooms().filter(rel => rel.role === 'follower').map(rel => rel.id);

		const places = action.user.params && action.user.params.places ? action.user.params.places : [];
		const rooms = places.filter(it => it.type !== 'state').map(it => it.id);
		const states = places.filter(it => it.type === 'state').map(it => it.id);

		const roomsData = {};

		try {
			const results = await Promise.all(rooms.map(id => query('getRooms', { ref: id })));

			for (let i = 0, l = results.length; i < l; i++) {
				if (results[i] && results[i].length) {
					const room = results[i][0];

					if (room) {
						roomsData[room.id] = room;
					}
				}
			}
		} catch (e) {
			// ignore
		}

		const parentRooms = [];

		for (let i = 0, l = rooms.length; i < l; i++) {
			const room = roomsData[rooms[i]];

			if (room && room.guides) {
				if (room.guides.alsoAutoFollow) {
					parentRooms.push(room.guides.alsoAutoFollow);
				}

				if (room.guides.alsoAutoFollowList) {
					Array.prototype.push.apply(parentRooms, room.guides.alsoAutoFollowList);
				}
			}
		}

		const roomsToProcess = [ ...rooms, ...parentRooms ];
		const statesToProcess = states.length ? parentRooms.map(room => states[0] + '-in-' + room) : [];

		const roomsSaved = [ ...roomsToProcess, ...statesToProcess ];
		const roomsShouldFollow = compact(difference(roomsSaved, roomsFollowing));
		const roomsShouldLeave = compact(difference(roomsFollowing, roomsSaved));

		try {
			await Promise.all([].concat(
				roomsShouldFollow.map(room => dispatch('join', { to: room })),
				roomsShouldLeave.map(room => dispatch('part', { to: room }))
			));
		} catch (e) {
			// ignore
		}
	});
}

export default { initialize };
