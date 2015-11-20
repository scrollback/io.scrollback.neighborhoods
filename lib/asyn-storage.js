"use strict";
import React from "react-native";
var {
	AsyncStorage
} = React;
var data = [];



function getJson(key){
	var copyArr = data;
	for(var item in copyArr){
		if(key === copyArr[item]["url"]){
			var json = copyArr[item]["json"];
			data.push(data.splice(item,1)[0]);
			AsyncStorage.setItem("embed_json", JSON.stringify(data));
			return json;
		}
	}
	return;
}

function readData(key, resolve, reject){
	AsyncStorage.getItem("embed_json").then(function(content){
		if(content !== null){
			data = JSON.parse(content);
			resolve(getJson(key));
		}else{
			AsyncStorage.setItem("embed_json", JSON.stringify(data));
			resolve();
		}	
	}).catch(function(err){
		reject(err);
	});
}

function saveData(resolve, reject){
	AsyncStorage.setItem("embed_json", JSON.stringify(data));
}


exports["default"] = {

	setItem: function setItem(key, value){
		return new Promise(function(resolve, reject){
			if(data.length >=100){
				data.splice(0,10);
			}
			data.push({url : key, json: value});
			saveData(resolve, reject);
		});
	},

	getItem: function getItem(key){
		return new Promise(function(resolve, reject){
			readData(key, resolve, reject);
		});
	},

	removeItem : function removeItem(key){
		delete data[key];
		return new Promise(function(resolve, reject){
			saveData(resolve, reject);
		});
	},

	clearCache : function clearCache(){
		data = [];
		var p = new Promise(function(resolve, reject){
			saveData(resolve, reject);
		});
	}

};

module.exports = exports["default"];