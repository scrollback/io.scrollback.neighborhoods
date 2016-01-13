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
	};
	fullscreen?: boolean
}

export type NavigationState = {
	routes: Array<Route>;
	index: number
}

export function convertURLToRoute(url: string): Route {
	const parts = url
					.replace(/^([a-z]+\:)?\/\/[^\/]+/, "") // strip host and protocol
					.replace(/\?[^\?]+/, "") // strip query params for now, as we don't use it right now
					.replace(/^\/|\/$/g, "") // strip leading and trailing slash
					.split("/");

	const room = parts[0];
	const thread = parts[1];

	switch (parts.length) {
	case 0:
		return {
			type: "home",
			props: {}
		};
	case 1:
		if (room === "me") {
			return {
				type: "home",
				props: {}
			};
		}

		return {
			type: "room",
			props: {
				room
			}
		};
	default:
		if (thread === "all") {
			return {
				type: "room",
				props: {
					room
				}
			};
		}

		return {
			type: "chat",
			props: {
				room,
				thread
			}
		};
	}
}

export function getHomeRoute(): Route {
	return {
		type: "home",
		props: {}
	};
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
	case "create":
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
