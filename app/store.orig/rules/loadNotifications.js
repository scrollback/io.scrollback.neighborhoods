module.exports = (core, config, store) => {
	core.on("init-dn", () => {
		core.emit("getNotes", {}, (err, res) => {
			let notes;

			if (err) {
				notes = [];
			} else {
				notes = res.results;
			}

			if (Array.isArray(notes)) {
				core.emit("setstate", { notes });
			}
		});
	}, 100);

	const actions = [ "note-dn", "note-up" ];

	actions.forEach(action => {
		core.on(action, note => {
			let roomId = store.get("nav", "room"),
				mode = store.get("nav", "mode");

			// TODO: figure out a better way
			if (mode === "chat") {
				let threadId = store.get("nav", "thread");

				if (note.group === roomId + "/" + (threadId || "all")) {
					return;
				}
			} else if (mode === "room") {
				if (note.group === roomId) {
					return;
				}
			}

			let notes = store.get("notes").slice(0);

			notes.push(note);

			core.emit("setstate", { notes });
		}, 10);
	});
};
