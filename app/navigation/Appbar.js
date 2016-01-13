/* @flow */

import React from "react-native";
import AppbarTouchable from "../views/AppbarTouchable";
import AppbarIcon from "../views/AppbarIcon";
import AnimatedTitle from "./AnimatedTitle";
import Colors from "../../Colors.json";

const {
	Animated,
	NavigationReducer,
	NavigationState,
	NavigationContainer,
	StyleSheet,
	Platform,
	PixelRatio,
	View,
	Text
} = React;

const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const styles = StyleSheet.create({
	appbar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.primary,
		borderBottomWidth: Platform.OS === "ios" ? 1 / PixelRatio.get() : 0,
		borderBottomColor: Colors.separator,
		height: APPBAR_HEIGHT,
		elevation: 4
	},

	titleText: {
		flex: 1,
		lineHeight: 27,
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.white
	}
});

class Appbar extends React.Component {
	_renderLeftComponent = (route): ?ReactElement => {
		if (this.props.leftComponent) {
			return <this.props.leftComponent {...route.props} />;
		}

		if (this.props.navigationState.index !== 0) {
			return (
				<AppbarTouchable onPress={this._handleBackPress}>
					<AppbarIcon name="arrow-back" />
				</AppbarTouchable>
			);
		}

		return null;
	};

	_renderRightComponent = (route): ?ReactElement => {
		if (this.props.rightComponent) {
			return <this.props.rightComponent {...route.props} />;
		}

		return null;
	};

	_renderTitle = (route, index, key) => {
		return (
			<AnimatedTitle
				key={key}
				index={index}
				position={this.props.position}
			>
				{route.titleComponent ?
					<route.titleComponent {...route.props} /> :
					<Text style={styles.titleText}>{route.title}</Text>
				}
			</AnimatedTitle>
		);
	};

	_handleBackPress = () => {
		this.props.onNavigation(new NavigationReducer.Actions.Pop());
	};

	render() {
		const state = this.props.navigationState;

		return (
			<Animated.View style={styles.appbar}>
				{state.mapToArray(this._renderTitle)}
				{state.mapToArray(this._renderLeftComponent)}
			</Animated.View>
		);
	}
}

Appbar.propTypes = {
	navigationState: React.PropTypes.instanceOf(NavigationState),
	onNavigation: React.PropTypes.func.isRequired,
	title: React.PropTypes.string,
	titleComponent: React.PropTypes.func,
	leftComponent: React.PropTypes.func,
	rightComponent: React.PropTypes.func,
	position: React.PropTypes.any.isRequired
};

export default NavigationContainer.create(Appbar);
