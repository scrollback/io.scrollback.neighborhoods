require("babel-core/register");
var regexes = require("./regexes");

global.fetch = require("node-fetch");
var mockery = require("mockery");

mockery.enable({
    warnOnReplace: false
});

mockery.registerMock("react-native", require("../mocks/react-native"));

var embed = require("./oembed.js").fetchData,
    assert = require("assert");


describe("oembed : ", function () {
	this.timeout(50000);
	it("should return correct oembedlink data : ", function () {
		return embed("https://www.youtube.com/watch?v=uVdV-lxRPFo").then(function (text) {
			assert(text.title === "Captain America: Civil War - Trailer World Premiere", "title is different");
			assert(text.type === "video", "it is not returning type video" );
			assert(text.width === 480 ,"bad width length");
			assert(text.height === 270 ,"bad height length");
			console.log(text);			
		});
	});

	it("should return correct opengraph data : ", function(){
		return embed("http://on.aol.com/video/officials-fox-lake-officer-s-death-a-suicide-519216799?context=PC:homepage:PL1944:1446706878971").then(function(text){
			assert(text.title === "Officials: Fox Lake Officer&#x27;s Death a Suicide");
			assert(text.type === "video", "It is not returning the article");
			assert(text.thumbnail_url === "http://feedapi.b2c.on.aol.com/v1.0/app/videos/aolon/519216799/images/470x264.jpg?region=US", "it is not returning the string");
			assert(text.width === "470");
			assert(text.height === "264");
			console.log(text);
		});
	});

	it("should return correct meta data : ", function(){
		return embed("http://www.w3schools.com/").then(function(text){
			assert(text.title === "W3Schools Online Web Tutorials");
			console.log(text);
		});
	});

	it("should return correct image data : ", function(){
		return embed("http://1.images.comedycentral.com/images/shows/GetSpooked/getspooked_thumbnail.jpg?width=640&height=360&crop=true").then(function(text){
			assert(text.type === "image","it should have image type");
			assert(text.thumbnail_url === "http://1.images.comedycentral.com/images/shows/GetSpooked/getspooked_thumbnail.jpg?width=640&height=360&crop=true" );
			console.log(text);
		});
	});
});


describe("tests for regex : ", function(){

	var link =regexes.link;
	var meta = regexes.propertyRegex("type");
	var cont = regexes.content;

	it("testing link regex : ", function(){
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
		var href = regexes.matchHTTP;
		var test1 = "<link href='http://manoj' type='application/json+oembed'>".match(link)[0].match(href);
		var test2 = "<link type='application/json+oembed' href='https://manoj' >".match(link)[0].match(href);
		var test3 = "<link something type='application/json+oembed'>".match(link)[0].match(href);
		assert(test1 !== null, "the value should not be null test1");
		assert(test2 !== null, "the value should not be null test2");
		assert(test3 === null, "the value should be null");
	});
	it("testing meta regex : ", function(){
		var test1 = "<meta>".match(meta);
		var test2 = "<meta property='og:time'>".match(meta);
		var test3 = "<meta manoj property='og:type' content='some'>".match(meta);
		assert(test1 === null, "the value of the test1 should be null");
		assert(test2 === null, "the value of the test2 should be null");
		assert(test3 !== null, "the value of the test3 should not be null" );
	});
	it("testing meta with content regex : ", function(){
		var test1 = "<meta manoj property='og:type' content='some'>".match(meta)[0].match(cont);
		var test2 = "<meta content='some'manoj property='og:type'>".match(meta)[0].match(cont);
		assert(test1 !== null, "the value of test1 should not be null");
		assert(test2 !== null, "the value of test2 should not be null");
	});
});