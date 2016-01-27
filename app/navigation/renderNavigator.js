/* @flow */

import React from "react-native";
import Modal from "../views/Modal";
import renderOverlay from "./renderOverlay";
import renderScene from "./renderScene";

const {
	NavigationAnimatedView,
	StyleSheet,
	NavigationReducer,
	BackAndroid
} = React;

const styles = StyleSheet.create({
	animatedView: {
		flex: 1,
	}
});

let _navState, _onNavigation;

BackAndroid.addEventListener("hardwareBackPress", () => {
	if (Modal.isShown()) {
		Modal.renderComponent(null);

		return true;
	}

	if (_onNavigation && _navState && _navState.index !== 0) {
		_onNavigation(new NavigationReducer.Actions.Pop());

		return true;
	}

	return false;
});

const renderNavigator = navState => {
	if (!navState) {
		return null;
	}

	// Hide modal on navigate
	if (Modal.isShown()) {
		Modal.renderComponent(null);
	}

	return (
		<NavigationAnimatedView
			navigationState={navState}
			style={styles.animatedView}
			renderOverlay={renderOverlay}
			renderScene={renderScene}
		/>
	);
};

export default renderNavigator;
