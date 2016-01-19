/* @flow */
/* eslint-disable react/no-multi-comp, react/jsx-no-bind */

import React from "react-native";
import AppText from "../views/AppText";
import AppbarTouchable from "../views/AppbarTouchable";
import AppbarIcon from "../views/AppbarIcon";
import Colors from "../../Colors.json";
import routeMapper from "../routes/routeMapper";

const {
	View,
	StyleSheet,
	Platform,
	NavigationHeader,
	NavigationReducer
} = React;

const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const styles = StyleSheet.create({
	header: {
		backgroundColor: Colors.primary
	},

	title: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		height: APPBAR_HEIGHT
	},

	titleText: {
		flex: 1,
		lineHeight: 27,
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.white,
		textAlign: Platform.OS === "ios" ? "center" : "left"
	},

	button: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center"
	}
});

const _renderTitleComponent = (route, index, onNavigation) => {
	const routeDesc = routeMapper(route);
	const TitleComponent = routeDesc.titleComponent;

	if (TitleComponent) {
		return <TitleComponent {...route.props} onNavigation={onNavigation} />;
	}

	if (routeDesc.title) {
		return (
			<View style={styles.title}>
				<AppText numberOfLines={1} style={styles.titleText}>{routeDesc.title}</AppText>
			</View>
		);
	}

	return null;
};

const _renderLeftComponent = (route, index, onNavigation) => {
	const routeDesc = routeMapper(route);
	const LeftComponent = routeDesc.leftComponent;

	if (LeftComponent) {
		return <LeftComponent {...route.props} onNavigation={onNavigation} />;
	}

	if (index !== 0) {
		return (
			<AppbarTouchable style={styles.button} onPress={() => onNavigation(new NavigationReducer.Actions.Pop())}>
				<AppbarIcon name="arrow-back" />
			</AppbarTouchable>
		);
	}
};

const _renderRightComponent = (route, index, onNavigation) => {
	const routeDesc = routeMapper(route);
	const RightComponent = routeDesc.rightComponent;

	if (RightComponent) {
		return <RightComponent {...route.props} onNavigation={onNavigation} />;
	}
};

const renderOverlay = function(navState: Object, onNavigation: Function): Function {
	return props => {
		if (navState.get(navState.index).fullscreen) {
			return null;
		}

		return (
			<NavigationHeader
				{...props}
				style={styles.header}
				renderTitleComponent={(route, index) => _renderTitleComponent(route, index, onNavigation)}
				renderLeftComponent={(route, index) => _renderLeftComponent(route, index, onNavigation)}
				renderRightComponent={(route, index) => _renderRightComponent(route, index, onNavigation)}
			/>
		);
	};
};

export default renderOverlay;
