/* @flow */

import React from "react-native";
import routeMapper from "../routes/routeMapper";

const {
	NavigationCard,
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	container: {
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
				<View style={[ styles.container, route.fullscreen ? null : styles.normal ]}>
					<RouteComponent
						 {...passProps}
						 style={styles.container}
						 onNavigation={onNavigation}
					/>
				</View>
			</NavigationCard>
		);
	};
};

export default renderScene;
