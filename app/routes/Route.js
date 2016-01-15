/*
 * Routes are in the format
 * string: '{type}?key1=value1&key2=value2'
 * object:
 * 		{
 * 			type: <type>,
 * 			props: <props>
 * 		}
 *
 * @flow
 */

export type Route = {
	type: string;
	props: {
		room?: string,
		thread?: string;
		title?: string;
		time?: number;
	};
	fullscreen?: boolean
}

export type NavigationState = {
	routes: Array<Route>;
	index: number
}

export function getHomeRoute(): Route {
	return {
		type: "home",
		props: {}
	};
}

export function convertRouteToURL(route: Route): string {
	if (typeof route !== "object" || route === null || typeof route.type !== "string") {
		throw new TypeError("Invalid route given");
	}

	switch (route.type) {
	case "room":
		return `/${encodeURIComponent(route.props.room || "")}`;
	case "chat":
		let title;

		if (route.props.title) {
			title = encodeURIComponent(route.props.title.toLowerCase().trim().replace(/['"]/g, "").replace(/\W+/g, "-").replace(/\-$/, ""));
		}

		return `/${encodeURIComponent(route.props.room || "")}/${encodeURIComponent(route.props.thread || "")}${title ? "?title=" + title : ""}`;
	case "notes":
	case "account":
		return `/p/${route.type}`;
	case "compose":
		return `/p/${route.type}?room=${encodeURIComponent(route.props.room || "")}`;
	case "details":
		return `/p/${route.type}?room=${encodeURIComponent(route.props.room || "")}&thread=${encodeURIComponent(route.props.thread || "")}`;
	default:
		return `/me`;
	}
}

export function convertURLToRoute(url: string): Route {
	if (typeof url !== "string") {
		throw new TypeError("Invalid URL given");
	}

	const parts = url
					.replace(/^([a-z]+\:)?\/\/[^\/]+/, "") // strip host and protocol
					.replace(/^\/|\/$/g, "") // strip leading and trailing slash
					.split("?");

	const params = parts[0].split("/");
	const query = parts[1] ? parts[1].split("&") : null;
	const name = params[0] ? decodeURIComponent(params[0]).toLowerCase() : null;
	const type = params[1] ? decodeURIComponent(params[1]).toLowerCase() : null;
	const props = {};

	if (query) {
		for (let i = 0, l = query.length; i < l; i++) {
			const kv = query[i].split("=");
			const key = decodeURIComponent(kv[0]).toLowerCase();
			const value = decodeURIComponent(kv[1]).toLowerCase();

			props[key] = key === "time" ? parseInt(value, 10) : value;
		}
	}

	if (name) {
		if (type) {
			if (name === "p") {
				return {
					type,
					props
				};
			}

			if (name.length < 3) {
				return getHomeRoute();
			}

			if (type === "all") {
				return {
					type: "room",
					props: {
						...props,
						room: name
					}
				};
			}

			return {
				type: "chat",
				props: {
					...props,
					room: name,
					thread: type
				}
			};
		} else {
			if (name.length < 3) {
				return getHomeRoute();
			} else {
				return {
					type: "room",
					props: {
						...props,
						room: name
					}
				};
			}
		}
	}

	return getHomeRoute();
}

export function convertRouteToState(route: Route): NavigationState {
	const state = {
		routes: [
			getHomeRoute()
		],
		index: 0
	};

	const room = {
		type: "room",
		props: route.props
	};

	const chat = {
		type: "room",
		props: route.props
	};

	switch (route.type) {
	case "room":
	case "notes":
	case "account":
		return {
			routes: [
				...state.routes,
				route
			],
			index: state.index + 1
		};
	case "chat":
	case "compose":
		return {
			routes: [
				...state.routes,
				room,
				route
			],
			index: state.index + 2
		};
	case "details":
		return {
			routes: [
				...state.routes,
				room,
				chat,
				route
			],
			index: state.index + 3
		};
	case "signin":
		return {
			routes: [ route ],
			index: 0
		};
	default:
		return state;
	}
}

export function convertURLToState(url: string): NavigationState {
	return convertRouteToState(convertURLToRoute(url));
}
