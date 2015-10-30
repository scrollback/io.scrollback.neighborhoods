import React from "react-native";
import VersionCodes from "../../modules/version-codes";

const {
	Platform,
	Animated,
	View,
	DeviceEventEmitter
} = React;

export default class KeyboardSpacer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			ignoreKeboard: Platform.OS === "android" && Platform.Version < VersionCodes.KITKAT,
			keyboardHeightAnim: new Animated.Value(0)
		};
	}

	componentWillMount() {
		if (this.state.ignoreKeboard) {
			return;
		}

		this._keyboardDidShowSubscription = DeviceEventEmitter.addListener("keyboardDidShow", e => this._keyboardDidShow(e));
		this._keyboardDidHideSubscription = DeviceEventEmitter.addListener("keyboardDidHide", e => this._keyboardDidHide(e));
	}

	componentWillUnmount() {
		if (this.state.ignoreKeboard) {
			return;
		}

		this._keyboardDidShowSubscription.remove();
		this._keyboardDidHideSubscription.remove();
	}

	_keyboardDidShow(e) {
		Animated.spring(this.state.keyboardHeightAnim, {
			toValue: e.endCoordinates.height
		}).start();
	}

	_keyboardDidHide() {
		Animated.spring(this.state.keyboardHeightAnim, {
			toValue: 0
		}).start();
	}

	render() {
		if (this.state.ignoreKeboard) {
			return null;
		}

		return <Animated.View style={{ height: this.state.keyboardHeightAnim }} />;
	}
}
