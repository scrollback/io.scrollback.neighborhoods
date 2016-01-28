import core from "./core";

function emit(type, params = {}) {
	return new Promise((resolve, reject) => {
		core.emit(type, params, (err, res) => {
			if (err) {
				reject(err);
			} else {
				resolve(res);
			}
		});
	});
}

function query(...args) {
	return emit(...args).then(res => res.results);
}

function dispatch(name, params = {}, prio = 1) {
	return new Promise(async (resolve, reject) => {
		const down = name + "-dn";

		let id;

		function cleanUp() {

			/* eslint-disable no-use-before-define */
			core.off(down, onSuccess);
			core.off("error-dn", onError);
		}

		function onSuccess(action) {
			if (id === action.id) {
				cleanUp();
				resolve(action);
			}
		}

		function onError(error) {
			if (id === error.id) {
				cleanUp();
				reject(error);
			}
		}

		core.on(down, onSuccess, prio);
		core.on("error-dn", onError, prio);

		try {
			const action = await emit(name + "-up", params);

			id = action.id;
		} catch (err) {
			cleanUp();
			reject(err);
		}
	});
}

export default {
	emit,
	query,
	dispatch,

	hideText(text) {
		const tags = Array.isArray(text.tags) ? text.tags.slice(0) : [];

		tags.push("hidden");

		if (text.id === text.thread) {
			tags.push("thread-hidden");
		}

		return dispatch("edit", {
			to: text.to,
			ref: text.id,
			tags
		});
	},

	unhideText(text) {
		return dispatch("edit", {
			to: text.to,
			ref: text.id,
			tags: text.tags.filter(t => t !== "thread-hidden" && t !== "hidden")
		});
	},

	banUser(text) {
		return dispatch("expel", {
			to: text.to,
			ref: text.from,
			role: "banned"
		});
	},

	unbanUser(text) {
		return dispatch("admit", {
			to: text.to,
			ref: text.from,
			role: "follower"
		});
	}
};
