"use strict";

module.exports = (...args) => {
	require("./rules/loadRooms.js")(...args);
	require("./rules/loadRelatedUsers.js")(...args);
	require("./rules/handleUserPresence.js")(...args);
	require("./rules/loadNotifications.js")(...args);
	require("./rules/resetNavRanges.js")(...args);
	require("./rules/loadTextsOnNav.js")(...args);
	require("./rules/loadThreadsOnNav.js")(...args);
	require("./rules/loadThread.js")(...args);
	require("./rules/dialogSignup.js")(...args);
	require("./rules/removeRelations.js")(...args);
	require("./rules/dissmissNoteOnNav.js")(...args);
	require("./rules/clearQueuedActions.js")(...args);
};
