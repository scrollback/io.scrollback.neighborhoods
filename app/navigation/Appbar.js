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

	titleArea: {
		flex: 1
	},

	titleText: {
		flex: 1,
		lineHeight: 27,
		fontSize: 18,
		fontWeight: "bold",
		color: Colors.white
	},

	button: {
		alignItems: "center",
		justifyContent: "center",
		height: APPBAR_HEIGHT,
		width: APPBAR_HEIGHT
	}
});

class Appbar extends React.Component {
	_renderLeftComponent = (): ?ReactElement => {
		if (this.props.leftComponent) {
			return <this.props.leftComponent onNavigation={this.props.onNavigation} {...this.props.passProps} />;
		}

		if (this.props.navigationState.index !== 0) {
			return (
				<AppbarTouchable onPress={this._handleBackPress}>
					<View style={styles.button}>
						<AppbarIcon name="arrow-back" />
					</View>
				</AppbarTouchable>
			);
		}

		return null;
	};

	_renderRightComponent = (): ?ReactElement => {
		if (this.props.rightComponent) {
			return <this.props.rightComponent onNavigation={this.props.onNavigation} {...this.props.passProps} />;
		}

		return null;
	};

	_renderTitle = (route, index, key) => {
		return (
			<AnimatedTitle
				key={key}
				index={index}
				position={this.props.position}
				style={styles.titleArea}
			>
				{this.props.titleComponent ?
					<this.props.titleComponent onNavigation={this.props.onNavigation} {...this.props.passProps} /> :
					<Text style={styles.titleText}>{this.props.title}</Text>
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
				{this._renderLeftComponent()}
				{state.mapToArray(this._renderTitle)}
				{this._renderRightComponent()}
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
	passProps: React.PropTypes.object,
	position: React.PropTypes.object.isRequired
};

export default NavigationContainer.create(Appbar);
