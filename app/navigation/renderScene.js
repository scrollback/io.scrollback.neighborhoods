/* @flow */

import React from "react-native";
import routeMapper from "../routes/routeMapper";

const {
	NavigationCard
} = React;

const renderScene = function(navState: Object, onNavigation: Function): Function {
	return props => {
		const route = navState.get(navState.index);
		const RouteComponent = routeMapper(route).component;

		return (
			<NavigationCard {...props}>
				<RouteComponent onNavigation={onNavigation} />
			</NavigationCard>
		);
	};
};

export default renderScene;
