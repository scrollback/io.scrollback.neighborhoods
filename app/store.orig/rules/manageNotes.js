// Server goes crazy when we try to dismiss notifications on every navigation.
// As of now, server only supports dismissing all notifications.
// But this is annoying for users as notifications don't really go away.
// So we need to handle this in better way which doesn't put load on server.
// We save the dismissed notifications in `AsyncStorage`, and avoid showing them.
// When there are no notifications left, we dismiss all notifications.

import { AsyncStorage } from "react-native";
import core from "../../store/core";
import store from "../../store/store";

const NOTIFICATION_STORE_KEY = "notifications_dismissed_store";

let dismissed = [];

function getNoteIdentifier(note) {
	return note.ref + ":" + note.group + ":" + note.noteType;
}

async function getDismissedNotes() {
	const notes = await AsyncStorage.getItem(NOTIFICATION_STORE_KEY);

	if (notes) {
		return JSON.parse(notes);
	} else {
		return null;
	}
}

function dismissAllNotes() {
	dismissed = [];
	core.emit("note-up", { dismissTime: Date.now() });

	return AsyncStorage.setItem(NOTIFICATION_STORE_KEY, "[]");
}

function dismissNote(note) {
	const notes = store.get("notes");

	if (notes.length === 0) {
		if (dismissed && dismissed.length) {
			dismissAllNotes();
		}

		if (Object.keys(note).length === 1) {
			return null;
		}
	}

	const dismiss = notes.filter(n => {
		if (note.noteType) {
			if (note.group) {
				return n.noteType === note.noteType && n.ref === note.ref && n.group === note.group;
			} else if (note.ref) {
				return n.noteType === note.noteType && n.ref === note.ref;
			} else {
				return n.noteType === note.noteType;
			}
		} else if (note.group) {
			if (note.ref) {
				return n.group === note.group && n.ref === note.ref;
			} else {
				return n.group === note.group;
			}
		} else if (note.ref) {
			return n.ref === note.ref;
		} else {
			return false;
		}
	});

	for (let i = 0, l = dismiss.length; i < l; i++) {
		const id = getNoteIdentifier(dismiss[i]);

		if (dismissed.indexOf(id) === -1) {
			dismissed.push(id);
		}
	}

	return AsyncStorage.setItem(NOTIFICATION_STORE_KEY, JSON.stringify(dismissed));
}

function loadNotes() {
	core.emit("getNotes", {}, async (err, res) => {
		let notes;

		if (err) {
			return;
		}

		if (res.results && res.results.length) {
			notes = res.results;

			try {
				dismissed = await getDismissedNotes();

				if (Array.isArray(dismissed)) {
					notes = notes.filter(n => dismissed.indexOf(getNoteIdentifier(n)) < 0);
				} else {
					dismissed = [];
				}
			} catch (e) {
				// Ignore
			}

			core.emit("setstate", { notes });
		}
	});
}

function receiveNote(note) {
	if (note.dismissTime) {
		dismissNote(note);
	}

	const notes = store.get("notes").slice(0);

	notes.push(note);

	core.emit("setstate", { notes });
}

function processChanges(changes) {
	if (changes.nav && (changes.nav.mode || changes.nav.room || "thread" in changes.nav)) {
		const future = store.with(changes);
		const roomId = future.get("nav", "room");
		const mode = future.get("nav", "mode");

		if (mode === "chat") {
			const threadId = future.get("nav", "thread");

			if (threadId) {
				receiveNote({
					group: roomId + "/" + threadId,
					dismissTime: Date.now()
				});

				receiveNote({
					noteType: "thread",
					ref: threadId,
					dismissTime: Date.now()
				});
			} else {
				receiveNote({
					group: roomId + "/all",
					dismissTime: Date.now()
				});
			}
		} else if (mode === "room") {
			receiveNote({
				noteType: "thread",
				group: roomId,
				dismissTime: Date.now()
			});
		}
	}
}

module.exports = () => {
	core.on("init-dn", () => loadNotes(), 100);
	core.on("note-up", note => receiveNote(note), 100);
	core.on("note-dn", note => receiveNote(note), 100);
	core.on("setstate", changes => processChanges(changes), 100);
};
