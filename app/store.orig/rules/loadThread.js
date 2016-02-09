module.exports = function(core, config, store) {
	core.on('setstate', changes => {
		const future = store.with(changes);

		if (changes && changes.nav && 'thread' in changes.nav && future.get('nav', 'mode') === 'chat') {
			const threadId = future.get('nav', 'thread');

			if (threadId) {
				const roomId = future.get('nav', 'room');
				const threadObj = future.getThreadById(threadId);

				if (!threadObj) {
					core.emit('getThreads', {
						ref: threadId,
						to: roomId
					}, (err, res) => {
						if (err) {
							return;
						}

						if (res && res.results && res.results[0]) {
							const thread = res.results[0];

							core.emit('setstate', {
								threads: {
									[thread.to]: [ {
										start: thread.startTime,
										end: thread.startTime,
										items: [ thread ]
									} ]
								}
							});
						}
					});
				}
			}
		}
	}, 850);
};
