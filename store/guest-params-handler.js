/* eslint-env browser */

"use strict";

var userUtils = require("../lib/user-utils.js");
var React = require('react-native');
var { AsyncStorage } = React;

module.exports = function(core, config, store) {
	var currentNotifications;
	AsyncStorage.getItem("notifications", function(err, data){
		if(err) throw err;
		try{
			currentNotifications = JSON.parse(currentNotifications);
		}catch(e){
			currentNotifications = {sound:true};
		}
	});

	core.on("user-dn", function(action, next) {
		var user = action.user;

		if (user.params && user.params.notifications && userUtils.isGuest(store.get("user"))) {
			currentNotifications = user.params.notifications;
			AsyncStorage.setItem("notifications", JSON.stringify(currentNotifications), function(err, data){
				if(err) next(err);
			});
		}
		next();
	}, 1000);

	core.on("setstate", function(changes, next) {
		var user = changes.user || store.get("user");

		if (changes.entities && changes.entities[user] && user && userUtils.isGuest(user)) {
			changes.entities[user].params = changes.entities[user].params || {};
			changes.entities[user].params.notifications = currentNotifications;
		}

		next();
	}, 800);
};
