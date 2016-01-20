/* eslint no-use-before-define:0 */

const permissionLevels = require("../../store.orig/permissionWeights");

module.exports = function(core, config, store) {
	core.on("setstate", changes => {
		const future = store.with(changes);
		const roomId = future.get("nav", "room");
		const userId = future.get("user");
		const rel = roomId + "_" + userId;
		const getRelation = store.getRelation(roomId, userId);
		const roomObj = store.getRoom(roomId);
		const userRelation = getRelation ? getRelation.role : "none";
		const guides = roomObj ? roomObj.guides : {};

		if (changes.app && changes.app.connectionStatus && store.get("app", "connectionStatus") === "offline" && future.get("app", "connectionStatus") === "online") {
			updateThreads(future);
		} else if (
			(changes.nav && (
				"room" in changes.nav ||
				roomId + "_requested" in changes.nav
			)) || (
				changes.entities &&
				changes.entities[rel]
			)) {
			if (
				(guides && guides.authorizer && (
					permissionLevels[userRelation] < permissionLevels[guides.authorizer.readLevel]
				)) || (
					userRelation === "banned"
				)) {
				return;
			}

			handleThreadChange(future);
		}
	}, 850);

	function threadResponse(err, threads) {
		if (err) {
			return;
		}

		const newState = { threads: {} };
		const range = {};

		if (threads.results && threads.results.length) {
			newState.threads[threads.to] = [];

			if (threads.before) {
				range.end = threads.time;
				range.start = threads.results.length < threads.before ? null : threads.results[0].startTime;
			} else if (threads.after) {
				newState.nav = { [threads.to + "_requested"]: store.get("nav", threads.to + "_requested") + threads.results.length - 1 };

				range.start = threads.time ? threads.time : Date.now();
				range.end = threads.results.length < threads.after ? null : threads.results[threads.results.length - 1].startTime;
			}

			range.items = threads.results;

			newState.threads[threads.to].push(range);

			core.emit("setstate", newState);
		}
	}

	function updateThreads(future) {
		const roomId = future.get("nav", "room");
		const lastThread = store.getThreads(roomId, null, -1)[0];

		if (lastThread && lastThread.startTime) {
			core.emit("getThreads", {
				to: roomId,
				time: lastThread.startTime,
				after: 100
			}, threadResponse);
		}
	}

	function handleThreadChange(future) {
		const roomId = future.get("nav", "room");
		const requested = future.get("nav", roomId + "_requested");

		if (!requested) {
			return;
		}

		const threads = store.getThreads(roomId, null, -requested);

		if (threads[0] === "missing") {
			core.emit("getThreads", {
				to: roomId,
				time: (threads.length > 1 ? threads[1].startTime : null),
				before: requested - threads.length + 1
			}, threadResponse);
		}

	}
};
