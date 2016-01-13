/* @flow */

import React from "react-native";
import routeMapper from "../routes/routeMapper";

const {
	NavigationCard,
	View,
	StyleSheet
} = React;

const styles = StyleSheet.create({
	scene: {
		flex: 1
	},

	normal: {
		marginTop: 56
	}
});

const renderScene = function(navState: Object, onNavigation: Function): Function {
	return props => {
		const route = navState.get(navState.index);
		const {
			component: RouteComponent,
			passProps
		} = routeMapper(route);

		return (
			<NavigationCard {...props}>
				<View style={[ styles.scene, route.fullscreen ? null : styles.normal ]}>
					<RouteComponent onNavigation={onNavigation} {...passProps} />
				</View>
			</NavigationCard>
		);
	};
};

export default renderScene;
