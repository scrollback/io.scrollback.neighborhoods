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
	const notes = store.get("notes");

	let dismiss;

	if (notes.length === 0 || Object.keys(note).length === 1) {
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
	}

	for (let i = 0, l = dismiss.length; i < l; i++) {
		const id = getNoteIdentifier(notes[i]);

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
			notes = [];
		} else {
			notes = res.results || [];
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
				core.emit("note-up", {
					group: roomId + "/" + threadId,
					dismissTime: Date.now()
				});

				core.emit("note-up", {
					noteType: "thread",
					ref: threadId,
					dismissTime: Date.now()
				});
			} else {
				core.emit("note-up", {
					group: roomId + "/all",
					dismissTime: Date.now()
				});
			}
		} else if (mode === "room") {
			core.emit("note-up", {
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
	core.on("statechange", changes => changes.notes && store.get("notes").length === 0 ? dismissAllNotes() : null, 100);
};
