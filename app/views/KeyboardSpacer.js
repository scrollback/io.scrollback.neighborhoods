import React from "react-native";

const {
	Animated,
	View,
	DeviceEventEmitter
} = React;

export default class KeyboardSpacer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			keyboardHeightAnim: new Animated.Value(0)
		};
	}

	componentWillMount() {
		this._registerEvents();
	}

	componentWillUnmount() {
		this._unRegisterEvents();
	}

	_registerEvents = () => {
		this._keyboardDidShowSubscription = DeviceEventEmitter.addListener("keyboardDidShow", e => this._keyboardDidShow(e));
		this._keyboardDidHideSubscription = DeviceEventEmitter.addListener("keyboardDidHide", e => this._keyboardDidHide(e));
	};

	_unRegisterEvents = () => {
		this._keyboardDidShowSubscription.remove();
		this._keyboardDidHideSubscription.remove();
	};

	_keyboardDidShow = e => {
		Animated.spring(this.state.keyboardHeightAnim, {
			toValue: e.endCoordinates.height
		}).start();
	};

	_keyboardDidHide = () => {
		Animated.spring(this.state.keyboardHeightAnim, {
			toValue: 0
		}).start();
	};

	render() {
		return <Animated.View style={{ height: this.state.keyboardHeightAnim }} />;
	}
}
