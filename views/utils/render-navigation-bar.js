import React from "react-native";
import Colors from "../../colors.json";
import NavigationBarRouteMapper from "./navigation-bar-route-mapper";

const {
	StyleSheet,
	Navigator
} = React;

const styles = StyleSheet.create({
	navbar: {
		backgroundColor: Colors.primary
	}
});

export default () => (
	<Navigator.NavigationBar
		routeMapper={NavigationBarRouteMapper}
		style={styles.navbar}
	/>
);
