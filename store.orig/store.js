import permissionWeights from "../authorizer/permissionWeights";
import userUtils from "../lib/user-utils";
import objUtils from "../lib/obj-utils";
import rangeOps from "../lib/range-ops";

const state = {
	nav: {
		mode: "loading",
		room: null
	},
	session: "",
	user: "",
	notes: [],
	texts: {},
	threads: {},
	entities: {},
	context: {},
	app: {
		listeningRooms: [],
		nearByRooms: [],
		connectionStatus: "connecting"
	},
	indexes: {
		threadsById: {},
		textsById: {},
		roomUsers: {},
		userRooms: {}
	}
};

function Store(objs) {
	// Handle situation where called without "new" keyword
	if ((this instanceof Store) === false) {
		throw new Error("Must be initialized before use");
	}

	// Throw error if not given an array as argument
	if (!Array.isArray(objs)) {
		throw new Error("Invalid array " + objs);
	}

	this._objs = objs;
}

Store.prototype.get = function(...args) {
	let value, arr;

	for (let i = this._objs.length, l = 0; i > l; i--) {
		arr = args.slice(0);

		arr.unshift(this._objs[i - 1]);

		value = objUtils.get.apply(null, arr);

		if (typeof value !== "undefined") {
			return value;
		}
	}
};

Store.prototype.with = function(obj) {
	const objs = this._objs.slice(0);

	objs.push(obj);

	return new Store(objs);
};

Store.prototype.getEntity = function(id) {
	return this.get("entities", id);
};

Store.prototype.getUser = function(id) {
	const userObj = this.getEntity(id || this.get("user"));

	if (typeof userObj === "object") {
		if (userObj.type === "user") {
			return userObj;
		}
	} else {
		return userObj;
	}
};

Store.prototype.getRoom = function(id) {
	const roomObj = this.getEntity(id || this.get("nav", "room"));

	if (typeof roomObj === "object") {
		if (roomObj.type === "room") {
			return roomObj;
		}
	} else {
		return roomObj;
	}
};

Store.prototype.getTexts = function(roomId, threadId, time, range) {
	const req = { time: time || null };
	const key = roomId + (threadId ? "_" + threadId : "");
	const texts = this.get("texts");

	if (range < 0) {
		req.before = range * -1;
	} else {
		req.after = range;
	}

	if (!(texts && texts[key])) {
		if (this.get("app", "connectionStatus") !== "online") {
			return [ "failed" ];
		} else if (!this.isRoomReadable(roomId)) {
			return [ "banned" ];
		} else if (this.getRoom(roomId) === "missing") {
			return [ "nonexistent" ];
		} else {
			return [ "missing" ];
		}
	}

	let data = rangeOps.getItems(texts[key], req, "time");

	if (!this.isUserAdmin()) {
		data = data.filter(text => !this.isHidden(text));
	}

	return data;
};

Store.prototype.getThreads = function(roomId, time, range) {
	const req = { startTime: time || null };
	const threads = this.get("threads");

	if (range < 0) {
		req.before = range * -1;
	} else {
		req.after = range;
	}

	if (!(threads && threads[roomId])) {
		if (this.get("app", "connectionStatus") !== "online") {
			return [ "failed" ];
		} else if (!this.isRoomReadable(roomId)) {
			return [ "banned" ];
		} else if (this.getRoom(roomId) === "missing") {
			return [ "nonexistent" ];
		} else {
			return [ "missing" ];
		}
	}

	let data = rangeOps.getItems(threads[roomId], req, "startTime");

	if (!this.isUserAdmin()) {
		data = data.filter(thread => !this.isHidden(thread));
	}

	return data;
};

Store.prototype.getThreadById = function(threadId) {
	return this.get("indexes", "threadsById", threadId);
};

Store.prototype.getTextById = function(threadId) {
	return this.get("indexes", "textsById", threadId);
};

Store.prototype.getRelation = function(roomId, userId) {
	return this.get("entities", (roomId || this.get("nav", "room")) + "_" + (userId || this.get("user")));
};

Store.prototype.getRelatedRooms = function(id, filter) {
	let user, relations;

	const rooms = [];

	if (typeof id === "string") {
		user = id;
	} else {
		user = this.get("user");

		if (typeof id === "object") {
			filter = id;
		}
	}

	relations = this.get("indexes", "userRooms", user);

	if (Array.isArray(relations)) {
		relations.forEach(roomRelation => {
			let roomObj, filterKeys, i;

			if (filter) {
				filterKeys = Object.keys(filter);
				for (i = 0; i < filterKeys.length; i++) {
					if (filter[filterKeys] !== roomRelation[filterKeys]) {
						return;
					}
				}
			}

			roomObj = this.getRoom(roomRelation.room);

			rooms.push(objUtils.merge(objUtils.clone(roomRelation), roomObj));
		});

	}

	return rooms;
};

Store.prototype.getRelatedUsers = function(id, filter) {
	let roomId, relations;

	const users = [];

	if (typeof id === "string") {
		roomId = id;
	} else if (typeof id === "object") {
		roomId = this.get("nav", "room");

		filter = id;
	} else {
		roomId = this.get("nav", "room");
	}

	relations = this.get("indexes", "roomUsers", roomId);

	if (Array.isArray(relations)) {
		relations.forEach(relation => {
			let userObj, filterKeys, i;

			if (filter) {
				filterKeys = Object.keys(filter);

				for (i = 0; i < filterKeys.length; i++) {
					if (filter[filterKeys] !== relation[filterKeys]) {
						return;
					}
				}
			}

			userObj = this.getUser(relation.user);

			users.push(objUtils.merge(objUtils.clone(relation), userObj));
		});
	}

	return users;
};

Store.prototype.getNearByRooms = function() {
	return this.get("app", "nearByRooms");
};

Store.prototype.getUserRole = function(userId, roomId) {
	let rel, role;

	userId = (typeof userId === "string") ? userId : this.get("user");

	rel = this.getRelation(roomId, userId);

	if (rel && rel.role && rel.role !== "none") {
		role = rel.role;
	} else {
		role = (!userId || userUtils.isGuest(userId)) ? "guest" : "registered";
	}

	return role;
};


Store.prototype.getNotes = function() {
	return this.get("notes");
};

Store.prototype.isUserAdmin = function(userId, roomId) {
	const role = this.getUserRole(userId, roomId);

	return permissionWeights[role] >= permissionWeights.moderator;
};

Store.prototype.isRoomReadable = function(roomId, userId) {
	const roomObj = this.getRoom(roomId);
	const readLevel = (roomObj && roomObj.guides && roomObj.guides.authorizer &&
						roomObj.guides.authorizer.readLevel) ? roomObj.guides.authorizer.readLevel : "guest";

	return (permissionWeights[this.getUserRole(userId, roomId)] >= permissionWeights[readLevel]);
};

Store.prototype.isHidden = function(text) {
	const { tags } = text;

	if (Array.isArray(tags) && (tags.indexOf("thread-hidden") > -1 || tags.indexOf("hidden") > -1 || tags.indexOf("abusive") > -1)) {
		return true;
	}

	return false;
};

module.exports = function(core, config) {
	const store = new Store([ state ]);

	require("./state-manager")(core, config, store, state);
	require("./action-handler")(core, config, store, state);
	require("./rule-manager")(core, config, store, state);
	require("./socket")(core, config, store, state);
	require("./session-manager")(core, config, store, state);

	return store;
};
