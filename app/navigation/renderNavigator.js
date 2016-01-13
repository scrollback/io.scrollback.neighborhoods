/* @flow */

import React from "react-native";
import renderOverlay from "./renderOverlay";
import renderScene from "./renderScene";

const {
	NavigationAnimatedView,
	StyleSheet
} = React;

const styles = StyleSheet.create({
	animatedView: {
		flex: 1,
	}
});

const renderNavigator = (): Function => {
	return (navState, onNavigation) => {
		if (!navState) {
			return null;
		}

		return (
			<NavigationAnimatedView
				navigationState={navState}
				style={styles.animatedView}
				renderOverlay={renderOverlay(navState, onNavigation)}
				renderScene={renderScene(navState, onNavigation)}
			/>
		);
	};
};

export default renderNavigator;
