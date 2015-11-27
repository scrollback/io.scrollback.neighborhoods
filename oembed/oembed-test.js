require("babel-core/register");

global.fetch = require("node-fetch");
var mockery = require("mockery");

mockery.enable({
    warnOnReplace: false
});
mockery.registerMock("react-native", require("./react-native-mock"));

var embed = require("./oembed.js").fetchData,
    assert = require("assert");

describe("Embed Testing : ", function () {
	this.timeout(50000);
	it("link with oembed", function () {
		return embed("https://www.youtube.com/watch?v=uVdV-lxRPFo").then(function (text) {
			assert(typeof text === "object", "It is not returning the object");
			assert(text.type === "video", "It is returning other than video" );
			console.log(text);			
		});
	});

	it("link with opengraph", function(){
		return embed("http://on.aol.com/video/officials-fox-lake-officer-s-death-a-suicide-519216799?context=PC:homepage:PL1944:1446706878971").then(function(text){
			assert(typeof text === "object", "It is failing to return the object");
			assert(text.type === "video", "It is not returning the article");
			assert(typeof text.thumbnail_url === "string", "it is not returning the string");
			console.log(text);
		});
	});

	it("link with meta", function(){
		return embed("http://www.w3schools.com/").then(function(text){
			assert(typeof text === "object", "It is failing to return the json object");
			assert(text.type === undefined, "It should return undefined");
			console.log(text);
		});
	});

	it("link with image", function(){
		return embed("http://1.images.comedycentral.com/images/shows/GetSpooked/getspooked_thumbnail.jpg?width=640&height=360&crop=true").then(function(text){
			assert(typeof text === "object", "It is failing to return the json object");
			assert(text.type === "image","it should have image type");
			console.log(text);
		});
	});
});


describe("tests for regex : ", function(){
	it("testing link regex : ", function(){
		var link = /<link[^>]*type[ ]*=[ ]*['|"]application\/json\+oembed['|"][^>]*[>]/;
		var test1 = "<link>".match(link);
		var test2 = "<link type='application/json+oembed'".match(link);
		var test3 = "<link something type='application/json+oembed'>".match(link);
		var test4 = "<link something type='application/json+oembed' something>".match(link);
		assert(test1 === null, "the value should be null");
		assert(test2 === null, "the value should be null");
		assert(test3 !== null, "the value should not be null");
		assert(test4 !== null, "the value should not be null");
	});
	it("testing link and href regex : ", function(){
		var link = /<link[^>]*type[ ]*=[ ]*['|"]application\/json\+oembed['|"][^>]*[>]/;
		var href = /http[s]?:\/\/[^"']/;
		var test1 = "<link href='http://manoj' type='application/json+oembed'>".match(link)[0].match(href);
		var test2 = "<link type='application/json+oembed' href='https://manoj' >".match(link)[0].match(href);
		var test3 = "<link something type='application/json+oembed'>".match(link)[0].match(href);
		assert(test1 !== null, "the value should not be null test1");
		assert(test2 !== null, "the value should not be null test2");
		assert(test3 === null, "the value should be null");
	});
	it("testing meta regex : ", function(){
		var meta = /<meta[^>]*property[ ]*=[ ]*['|"]og:type['|"][^>]*[>]/;
		var test1 = "<meta>".match(meta);
		var test2 = "<meta property='og:time'>".match(meta);
		var test3 = "<meta manoj property='og:type' content='some'>".match(meta);
		assert(test1 === null, "the value of the test1 should be null");
		assert(test2 === null, "the value of the test2 should be null");
		assert(test3 !== null, "the value of the test3 should not be null" );
	});
	it("testing meta with content regex : ", function(){
		var meta = /<meta[^>]*property[ ]*=[ ]*['|"]og:type['|"][^>]*[>]/;
		var cont = /content[ ]*=[ ]*["|'][^"']*/;
		var test1 = "<meta manoj property='og:type' content='some'>".match(meta)[0].match(cont);
		var test2 = "<meta content='some'manoj property='og:type'>".match(meta)[0].match(cont);
		assert(test1 !== null, "the value of test1 should not be null");
		assert(test2 !== null, "the value of test2 should not be null");
	});
});