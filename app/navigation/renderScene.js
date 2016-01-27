/* @flow */

import React from "react-native";
import routeMapper from "../routes/routeMapper";
import Colors from "../../Colors.json";

const {
	NavigationCard,
	NavigationContainer,
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightGrey
	},

	normal: {
		marginTop: 56
	}
});

const renderScene = (route, index, navState, position, layout) => {
	const RouteComponent = NavigationContainer.create(routeMapper(route).component);

	return (
		<NavigationCard
			route={route}
			index={index}
			navState={navState}
			position={position}
			layout={layout}
		>
			<View style={[ styles.container, route.fullscreen ? null : styles.normal ]}>
				<RouteComponent
					 {...route.props}
					 style={styles.container}
				/>
			</View>
		</NavigationCard>
	);
};

export default renderScene;
