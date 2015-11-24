'use strict';

import store from "./asyn-storage.js";

function deleteUndefProp(obj){
	for(var prop in obj){
		if(typeof obj[prop] === "undefined"){
			delete obj[prop];
		}if(prop === "thumbnail_url"){
			if(obj[prop].indexOf("http") === -1 ){
				obj[prop] = "http:"+ obj[prop];
			}
		}
	}
	return obj;
}


function fetchJsonUrl(url, jsonUrl) {
	return fetch(jsonUrl).then(function(res){
		return res.json();
	}).then(function(json){
		store.setItem(url, json).catch(function(err){
			console.log(err);
		});
		return json;
	}).catch(function(err){
		console.log(err);
	});
}

function openGraph(body){
	var bodyString = body.replace(/(\r\n|\n|\r)/gm,"");
	var meta = /<meta[^>]*property[ ]*=[ ]*['|"]og:type['|"][^>]*[>]/i;
	var link = /<link[^>]*type[ ]*=[ ]*['|"]application\/json\+oembed['|"][^>]*[>]/i;
	var href = /http[s]?:\/\/[^"']*/i;
	var cont = /content[ ]*=[ ]*["|'][^"']*/i;
	var res = bodyString.match(link);
	if(res !== null){
		return res[0].match(href)[0];
	}else{
		var checkOembed = bodyString.match(meta);
		var objJson = {};
		var pA1 = ["type", "title", "description"];
		var pA2 = ["width", "height"];
		for(var i=0;i<pA1.length;i++){
			var main = new RegExp("<meta[^>]*property[ ]*=[ ]*['|\"]og:"+pA1[i]+"['|\"][^>]*[>]");
			var oembedT1 = bodyString.match(main);
			if( oembedT1 !== null){
				objJson[pA1[i]] = oembedT1[0].match(cont)[0].match(/['|"].*/)[0].slice(1);
			}
		}
		for(var i=0; i<pA2.length;i++){
			var type = ["video", "image"];
			for(var j=0;j<type.length;j++){
				var main = new RegExp("<meta[^>]*property[ ]*=[ ]*['|\"]og:"+type[j]+":"+pA2[i]+"['|\"][^>]*[>]");
				var oembedT2 = bodyString.match(main);
				if( oembedT2 !== null){
					objJson[pA2[i]] = oembedT2[0].match(cont)[0].match(/['|"][^'|^"]*/)[0].slice(1);
				}
			}
		}
		var oembedT3 = bodyString.match(/<meta[^>]*property[ ]*=[ ]*['|\"]og:image['|"][^>]*[>]/);
		if( oembedT3 !== null){
			objJson['thumbnail_url'] = oembedT3[0].match(cont)[0].match(/['|"][^'|^"]*/)[0].slice(1);
		}
		var desc = /<meta[^>]*name[ ]*=[ ]*['|"]description['|"][^>]*[>]/;
		var title = bodyString.match(/<title>[^>]*/);
		var descT = bodyString.match(desc);
		if( title !== null && !objJson.title){
			objJson["title"] = title[0].match(/[>][^<]*/)[0].slice(1);
		}
		if( descT !== null && !objJson.description){
			objJson["description"] = descT[0].match(cont)[0].match(/['|"][^'|^"]*/)[0].slice(1);
		}
		return deleteUndefProp(objJson);
	}
}

function storeCheck(url, data){
	if(typeof data === "undefined"){
		return fetch(url).then(function(res){
			return res.text();
		}).then(function(body){
			return openGraph(body);
		}).then(function (json) {
			if (typeof json === "string") {
				return fetchJsonUrl(url, json);
			} else if(typeof json === "object"){
				store.setItem(url, json).catch(function(err){
					console.log(err);
				});
				return json;
			} else {
				throw new Error("url error");
			}
		}).catch(function(err){
			console.log(err);
		});
	}else{
		console.log("returning from storage");
		return data;
	}
}

module.exports = function embed(url) {
	return fetch(url).then(function(res){
		if(url.match(/(\.jpg|\.png)/) === null){
			return store.getItem(url).then(function(data){
				return storeCheck(url, data);
			});
		}else if(url.match(/(\.jpg|\.png)/) !== null) {
			console.log("manoj is here");
			return store.getItem(url).then(function(data){
				if(typeof data === "undefined"){
					store.setItem(url, {type:"image", 'thumbnail_url': url}).catch(function(err){
						console.log(err);
					});
					return {"type":"image", "thumbnail_url": url};
				}else{
					return data;
				}
			});
		}
	});
};
