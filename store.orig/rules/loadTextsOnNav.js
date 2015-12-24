/* eslint no-use-before-define:0 */

const permissionLevels = require("../../authorizer/permissionWeights");

module.exports = function(core, config, store) {
	core.on("setstate", changes => {
		const future = store.with(changes);
		const roomId = future.get("nav", "room");
		const threadId = future.get("nav", "thread");
		const userId = future.get("user");
		const rel = roomId + "_" + userId;
		const getRelation = store.getRelation(roomId, userId);
		const roomObj = store.getRoom(roomId);
		const userRelation = getRelation ? getRelation.role : "none";
		const guides = roomObj ? roomObj.guides : {};

		if (changes.app && changes.app.connectionStatus && store.get("app", "connectionStatus") === "offline" && future.get("app", "connectionStatus") === "online") {
			updateTexts(future);
		} else if (
			(changes.nav && (
				"room" in changes.nav ||
				"thread" in changes.nav ||
				roomId + "_" + threadId + "_requested" in changes.nav
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

			handleTextChange(future);
		}
	}, 850);

	function textResponse(err, texts) {
		if (err) {
			return;
		}

		const newState = { texts: {} };
		const range = {};

		if (texts.results && texts.results.length) {
			const key = texts.to + "_" + texts.thread;

			newState.texts[key] = [];

			if (texts.before) {
				range.end = texts.time;
				range.start = texts.results.length < texts.before ? null : texts.results[0].time;
			} else if (texts.after) {
				newState.nav = { [key + "_requested"]: store.get("nav", key + "_requested") + texts.results.length - 1 };

				range.start = texts.time ? texts.time : Date.now();
				range.end = texts.results.length < texts.after ? null : texts.results[texts.results.length - 1].time;
			}

			range.items = texts.results;

			newState.texts[key].push(range);

			core.emit("setstate", newState);
		}
	}

	function updateTexts(future) {
		const roomId = future.get("nav", "room");
		const threadId = future.get("nav", "thread");
		const lastText = store.getTexts(roomId, threadId, null, -1)[0];

		if (lastText && lastText.time) {
			core.emit("getTexts", {
				to: roomId,
				thread: threadId,
				time: lastText.time,
				after: 100
			}, textResponse);
		}
	}

	function handleTextChange(future) {
		const roomId = future.get("nav", "room");
		const threadId = future.get("nav", "thread");
		const requested = future.get("nav", roomId + "_" + threadId + "_requested");

		if (!requested) {
			return;
		}

		const texts = store.getTexts(roomId, threadId, null, -requested);

		if (texts[0] === "missing") {
			core.emit("getTexts", {
				to: roomId,
				thread: threadId,
				time: (texts.length > 1 ? texts[1].time : null),
				before: requested - texts.length + 1
			}, textResponse);
		}
	}
};
