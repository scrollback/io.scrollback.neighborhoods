/* @flow */

import React from "react-native";
import routeMapper from "../routes/routeMapper";
import Colors from "../../Colors.json";

const {
	NavigationCard,
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

const renderScene = function(navState: Object, onNavigation: Function): Function {
	return props => {
		const route = props.sceneRecord.get("route"); // eslint-disable-line react/prop-types

		const {
			component: RouteComponent
		} = routeMapper(route);

		return (
			<NavigationCard {...props}>
				<View style={[ styles.container, route.fullscreen ? null : styles.normal ]}>
					<RouteComponent
						 {...route.props}
						 style={styles.container}
						 onNavigation={onNavigation}
					/>
				</View>
			</NavigationCard>
		);
	};
};

export default renderScene;
