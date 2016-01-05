import React from "react-native";
import Colors from "../../Colors.json";
import NavigationBarRouteMapper from "./NavigationBarRouteMapper";

const {
	StyleSheet,
	Navigator
} = React;

const styles = StyleSheet.create({
	navbar: {
		backgroundColor: Colors.primary,
		elevation: 4
	}
});

export default () => (
	<Navigator.NavigationBar
		routeMapper={NavigationBarRouteMapper}
		style={styles.navbar}
	/>
);
