"use strict";

module.exports = (...args) => {
	require("./rules/loadRooms")(...args);
	require("./rules/loadRelatedUsers")(...args);
	require("./rules/handleUserPresence")(...args);
	require("./rules/loadTextsOnNav")(...args);
	require("./rules/loadThreadsOnNav")(...args);
	require("./rules/loadThread")(...args);
	require("./rules/removeRelations")(...args);
	require("./rules/manageNotes")(...args);
	require("./rules/clearQueuedActions")(...args);
};
