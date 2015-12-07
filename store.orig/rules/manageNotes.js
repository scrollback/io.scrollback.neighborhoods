// Server goes crazy when we try to dismiss notifications on every navigation
// As of now, server only supports dismissing all notifications
// But this is annoying for users as notifications don't really go away
// So we need to handle this in better way which doesn't put load on server
// We save the dismissed notifications in `AsyncStorage`, and avoid showing them
// When there are no notifications left, we dismiss all notifications

import { AsyncStorage } from "react-native";
import core from "../../store/core";
import store from "../../store/store";

const NOTIFICATION_STORE_KEY = "notifications_dismissed_store";

let dismissed;

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
	let notes = store.get("notes").slice(0),
		dismiss;

	if (!notes.length) {
		return null;
	}

	if (note.noteType) {
		if (note.group) {
			dismiss = [];

			for (let i = 0, l = notes.length; i < l; i++) {
				const n = notes[i];

				if (n.noteType === note.noteType && n.ref === note.ref && n.group === note.group) {
					dismiss.push(n);

					break;
				}
			}
		} else if (note.ref) {
			dismiss = notes.filter(n => n.noteType === note.noteType && n.ref === note.ref);
		} else {
			dismiss = notes.filter(n => n.noteType === note.noteType);
		}
	} else if (note.group) {
		if (note.ref) {
			dismiss = notes.filter(n => n.group === note.group && n.ref === note.ref);
		} else {
			dismiss = notes.filter(n => n.group === note.group);
		}
	} else if (note.ref) {
		dismiss = notes.filter(n => n.ref === note.ref);
	} else {
		// dismiss all
		notes = [];
		dismiss = [];
	}

	for (let i = 0, l = dismiss.length; i < l; i++) {
		const id = getNoteIdentifier(notes[i]);

		if (dismissed.indexOf(id) === -1) {
			dismissed.push(id);
		}
	}

	if (!note.dismissTime) {
		note.dismissTime = Date.now();
	}

	notes.push(note);
	core.emit("setstate", { notes });

	if (notes.length) {
		return AsyncStorage.setItem(NOTIFICATION_STORE_KEY, JSON.stringify(dismissed));
	} else {
		return dismissAllNotes();
	}
}

function loadNotes() {
	core.emit("getNotes", {}, async (err, res) => {
		let notes;

		if (err) {
			notes = [];
		} else {
			notes = res.results;
		}

		dismissed = await getDismissedNotes();

		if (Array.isArray(dismissed)) {
			notes = notes.filter(n => dismissed.indexOf(getNoteIdentifier(n)) === -1);
		} else {
			dismissed = [];
		}

		core.emit("setstate", { notes });
	});
}

function receiveNote(note) {
	if (note.dismissTime) {
		return;
	}

	const notes = store.get("notes").slice(0);

	notes.push(note);
	core.emit("setstate", { notes });
}

async function processChanges(changes) {
	if (changes.nav && (changes.nav.mode || changes.nav.room || "thread" in changes.nav)) {
		const future = store.with(changes);
		const roomId = future.get("nav", "room");
		const mode = future.get("nav", "mode");

		if (mode === "chat") {
			const threadId = future.get("nav", "thread");

			if (threadId) {
				await dismissNote({
					group: roomId + "/" + threadId
				});

				dismissNote({
					noteType: "thread",
					ref: threadId
				});
			} else {
				dismissNote({
					group: roomId + "/all"
				});
			}
		} else if (mode === "room") {
			dismissNote({
				noteType: "thread",
				group: roomId
			});
		}
	}
}

module.exports = () => {
	core.on("init-dn", () => loadNotes(), 100);
	core.on("note-dn", note => receiveNote(note), 100);
	core.on("note-up", note => note.dismissTime ? dismissNote(note) : null, 100);
	core.on("setstate", changes => processChanges(changes), 100);
};
