import store from "./store-next";
import actions from "./actions";
import rangeOps from "../lib/range-ops";

const LOADING = "loading";
const MISSING = "missing";
const FAILED = "failed";
const BANNED = "banned";

store.provide("connection", {
	get: () => store._state.app.connectionStatus,

	notify: (o, changes) => changes.app && "connectionStatus" in changes.entities
});

store.provide("me", {
	get: () => store._state.user,

	notify: (o, changes) => "user" in changes
});

store.provide("user", {
	query: ({ id }) => {
		return actions.query("getUsers", { ref: id })
		.then(results => {
			store.setstate({
				entities: {
					[id]: results.length ? results[0] : MISSING
				}
			});
		})
		.catch(() => {
			store.setstate({
				entities: {
					[id]: MISSING
				}
			});
		});
	},

	get: ({ id }) => {
		const user = store._state.entities[id];

		if (typeof user === "object") {
			if (user.type === "user") {
				return user;
			} else {
				return MISSING;
			}
		}

		if (user === MISSING) {
			return MISSING;
		}

		return LOADING;
	},

	notify: ({ id }, changes) => changes.entities && id in changes.entities
});

store.provide("room", {
	query: ({ id }) => {
		return actions.query("getRooms", { ref: id })
		.then(results => {
			store.setstate({
				entities: {
					[id]: results.length ? results[0] : MISSING
				}
			});
		})
		.catch(() => {
			store.setstate({
				entities: {
					[id]: MISSING
				}
			});
		});
	},

	get: ({ id }) => {
		const room = store._state.entities[id];

		if (typeof room === "object") {
			if (room.type === "room") {
				return room;
			} else {
				return MISSING;
			}
		}

		if (room === MISSING) {
			return MISSING;
		}

		return LOADING;
	},

	notify: ({ id }, changes) => changes.entities && id in changes.entities
});

store.provide("thread", {
	query: ({ id, room }) => {
		return actions.query("getThreads", {
			ref: id,
			to: room
		})
		.then(results => {
			if (results.length) {
				const thread = results[0];

				store.setstate({
					threads: {
						[room]: [ {
							start: thread.startTime,
							end: thread.startTime,
							items: [ thread ]
						} ]
					}
				});
			}
		});
	},

	get: ({ id, room }) => {
		if (store.utils.isRoomReadable(room)) {
			const thread = store._state.indexes.threadsById[id];

			if (thread && store.utils.isHidden(thread) && !store.utils.isUserAdmin()) {
				return MISSING;
			}

			if (typeof thread === "object") {
				return thread;
			}

			if (store.get("connection") !== "online") {
				return FAILED;
			}

			return LOADING;
		}

		return BANNED;
	},

	notify: ({ id }, changes) => changes.indexes && changes.indexes.threadsById && changes.indexes.threadsById[id]
});

store.provide("threads", {
	query: () => {
		// TODO
	},

	get: ({ room, time, range }) => {
		const req = { startTime: time || null };
		const threads = this._state.threads;

		if (range < 0) {
			req.before = range * -1;
		} else {
			req.after = range;
		}

		if (threads && threads[room]) {
			let data = rangeOps.getItems(threads[room], req, "startTime");

			if (!this.isUserAdmin()) {
				data = data.filter(thread => !this.isHidden(thread));
			}

			return data;
		}

		if (store.get("connection") !== "online") {
			return [ FAILED ];
		}

		if (!this.isRoomReadable(room)) {
			return [ BANNED ];
		}

		return [ LOADING ];
	},

	notify: ({ room }, changes) => changes.threads && changes.threads[room]
});

store.provide("texts", {
	query: () => {
		// TODO
	},

	get: ({ room, thread, time, range }) => {
		const req = { time: time || null };
		const key = room + (thread ? "_" + thread : "");
		const texts = this._state.texts;

		if (range < 0) {
			req.before = range * -1;
		} else {
			req.after = range;
		}

		if (texts && texts[key]) {
			let data = rangeOps.getItems(texts[key], req, "time");

			if (!this.isUserAdmin()) {
				data = data.filter(text => !this.isHidden(text));
			}

			return data;
		}

		if (store.get("connection") !== "online") {
			return [ FAILED ];
		}

		if (!this.isRoomReadable(room)) {
			return [ BANNED ];
		}

		return [ LOADING ];
	},

	notify: ({ room }, changes) => changes.threads && changes.threads[room]
});
