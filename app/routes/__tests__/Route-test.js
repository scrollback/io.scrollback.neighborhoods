/* global jest, expect, describe, it */

jest.dontMock("../Route");

const { convertURLToRoute, convertRouteToURL } = require("../Route");

describe("convertURLToRoute", () => {
	it("should throw error on invalid url", () => {
		expect(() => {
			convertURLToRoute(null);
		}).toThrow("Invalid URL given");
	});

	it("should ignore protocol and host", () => {
		const result = {
			name: "room",
			props: {
				room: "someroom"
			}
		};

		expect(result).toEqual(convertURLToRoute("https://heyneighbor.chat/someroom/all/all-messages"));
		expect(result).toEqual(convertURLToRoute("http://localhost:7528/someroom/all/all-messages"));
		expect(result).toEqual(convertURLToRoute("//localhost:7528/someroom/all/all-messages"));
		expect(result).toEqual(convertURLToRoute("/someroom/all/all-messages"));
		expect(result).toEqual(convertURLToRoute("someroom/all/all-messages"));
	});

	it("should parse url with /me", () => {
		expect({
			name: "home",
			props: {}
		}).toEqual(convertURLToRoute("/me"));
	});

	it("should parse url with /roomname", () => {
		expect({
			name: "room",
			props: {
				room: "someroom"
			}
		}).toEqual(convertURLToRoute("/someroom"));
	});

	it("should parse url with incorrect case /RoomName", () => {
		expect({
			name: "room",
			props: {
				room: "someroom"
			}
		}).toEqual(convertURLToRoute("/SomeRoom"));
	});

	it("should parse url with /roomname/all", () => {
		expect({
			name: "room",
			props: {
				room: "someroom"
			}
		}).toEqual(convertURLToRoute("/someroom/all"));
	});

	it("should parse url with /roomname/all/all-messages", () => {
		expect({
			name: "room",
			props: {
				room: "someroom"
			}
		}).toEqual(convertURLToRoute("/someroom/all/all-messages"));
	});

	it("should parse url with /roomname/threadid", () => {
		expect({
			name: "chat",
			props: {
				room: "someroom",
				thread: "abc456def"
			}
		}).toEqual(convertURLToRoute("/someroom/abc456def"));
	});

	it("should parse url with /roomname/threadid/some-thread-title", () => {
		expect({
			name: "chat",
			props: {
				room: "someroom",
				thread: "abc456def"
			}
		}).toEqual(convertURLToRoute("/someroom/abc456def/awesome-thread-is-this"));
	});

	it("should parse url with /roomname?time=1214340045721", () => {
		expect({
			name: "room",
			props: {
				room: "someroom",
				time: 1214340045721
			}
		}).toEqual(convertURLToRoute("/someroom?time=1214340045721"));
	});

	it("should parse url with /roomname/all/all-messages?time=1214340045721", () => {
		expect({
			name: "room",
			props: {
				room: "someroom",
				time: 1214340045721
			}
		}).toEqual(convertURLToRoute("/someroom/all/all-messages?time=1214340045721"));
	});

	it("should parse url with /roomname/threadid?time=1214340045721", () => {
		expect({
			name: "chat",
			props: {
				room: "someroom",
				thread: "abc456def",
				time: 1214340045721
			}
		}).toEqual(convertURLToRoute("/someroom/abc456def?time=1214340045721"));
	});

	it("should parse url with /roomname/threadid/some-thread-title?t=1214340045721", () => {
		expect({
			name: "chat",
			props: {
				room: "someroom",
				thread: "abc456def",
				time: 1214340045721
			}
		}).toEqual(convertURLToRoute("/someroom/abc456def/awesome-thread-is-this?time=1214340045721"));
	});

	it("should parse url when room in invalid", () => {
		const result = {
			name: "home",
			props: {}
		};

		expect(result).toEqual(convertURLToRoute("/b"));
		expect(result).toEqual(convertURLToRoute("/um"));
		expect(result).toEqual(convertURLToRoute("/nm/abc456def/such-thread/?time=1214340045721"));
	});

	it("should parse url with /p/room?room=roomname", () => {
		expect({
			name: "room",
			props: {
				room: "someroom"
			}
		}).toEqual(convertURLToRoute("/p/room?room=someroom"));
	});

	it("should parse url with /p/chat/?room=roomname&thread=threadid", () => {
		expect({
			name: "chat",
			props: {
				room: "someroom",
				thread: "abc456def"
			}
		}).toEqual(convertURLToRoute("/p/chat/?room=someroom&thread=abc456def"));
	});

	it("should parse url with /p/notes", () => {
		expect({
			name: "notes",
			props: {}
		}).toEqual(convertURLToRoute("/p/notes"));
	});

	it("should parse url with /p/account/", () => {
		expect({
			name: "account",
			props: {}
		}).toEqual(convertURLToRoute("/p/account/"));
	});
});

describe("convertRouteToURL", () => {
	it("should throw error on invalid state", () => {
		const route1 = "somestring";
		const route2 = { hey: "ho" };

		expect(() => {
			convertRouteToURL(route1);
		}).toThrow("Invalid route given");

		expect(() => {
			convertRouteToURL(route2);
		}).toThrow("Invalid route given");
	});

	it("should build url with home", () => {
		expect("/me").toEqual(convertRouteToURL({
			name: "home",
			props: {}
		}));
	});

	it("should build url with room", () => {
		expect("/someroom").toEqual(convertRouteToURL({
			name: "room",
			props: {
				room: "someroom"
			}
		}));
	});

	it("should build url with thread", () => {
		expect("/someroom/abc456def").toEqual(convertRouteToURL({
			name: "chat",
			props: {
				room: "someroom",
				thread: "abc456def"
			}
		}));
	});

	it("should build url when thread is not given", () => {
		expect("/someroom").toEqual(convertRouteToURL({
			name: "room",
			props: {
				room: "someroom",
				thread: null
			}
		}));
	});

	it("should build url when thread title is given", () => {
		expect("/someroom/abc456def?title=such-awesome-much-thread-wow").toEqual(convertRouteToURL({
			name: "chat",
			props: {
				room: "someroom",
				thread: "abc456def",
				title: "Such awesome. Much thread. Wow!"
			}
		}));
	});
});
