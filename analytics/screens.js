import Answers from "../modules/answers";
import store from "../store/store";
import core from "../store/core";

function start() {
	let currentRoom;

	core.on("statechange", changes => {
		if (changes.nav && changes.nav.mode) {
			const mode = store.get("nav", "mode");

			if (mode === "chat" || mode === "room") {
				const room = store.get("nav", "room");

				if (room !== currentRoom) {
					Answers.logContentView("Screen", "Community", room);
				}
			}
		}
	});
}

export default {
	start
};
