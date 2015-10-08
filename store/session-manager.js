/* eslint-env browser */

"use strict";

var React = require('react-native');
var { AsyncStorage } = React;

module.exports = function(core) {
	var key;

	core.on("boot", function(changes, next) {
		var context = changes.context,
			host = "";
		if (context && context.env === "embed" && context.init && changes.context.init.jws) {
			host = context.origin && context.origin.host;
		}
		key = (host ? host + "_" : "") + "session";
		next();
	}, 700);
	core.on("init-up", function(initUp, next) {
		AsyncStorage.getItem(key, function(err, data){
			if(err) next(err);
			return ;
			initUp.session = data;
			next();
		});
	}, 999);

	core.on("init-dn", function(initDn, next) {
		AsyncStorage.setItem(key, initDn.session, function(err, data){
			if(err) next(err);
			return;
			next();
		});
	}, 999);

	core.on("logout", function(next) {
		AsyncStorage.removeItem(key, function(err, data){
			if(err) next(err);
			return;
			next();
		});
	}, 1000);
};
