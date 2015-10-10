import React from "react-native";
import GrowingTextInput from "./growing-text-input";

const {
	View,
	StyleSheet,
	TouchableHighlight,
	Image,
	PixelRatio,
	DeviceEventEmitter
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "stretch",
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .24)",
		borderTopWidth: 1 / PixelRatio.get()
	},
	inputContainer: {
		flex: 1,
		paddingHorizontal: 16
	},
	input: {
		color: "#000",
		backgroundColor: "transparent",
		paddingVertical: 16,
		margin: 0
	},
	iconContainer: {
		alignItems: "center",
		justifyContent: "center"
	},
	icon: {
		width: 24,
		height: 24,
		opacity: 0.5,
		margin: 16
	}
});

export default class ChatInput extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			keyboardHeight: 0
		};
	}

	componentWillMount() {
		this._keyboardWillShowSubscription = DeviceEventEmitter.addListener("keyboardDidShow", e => this._keyboardDidShow(e));
		this._keyboardWillHideSubscription = DeviceEventEmitter.addListener("keyboardDidHide", e => this._keyboardDidHide(e));
	}

	componentWillUnmount() {
		this._keyboardWillShowSubscription.remove();
		this._keyboardWillHideSubscription.remove();
	}

	_keyboardDidShow(e) {
		this.setState({
			keyboardHeight: e.endCoordinates.height
		});
	}

	_keyboardDidHide() {
		this.setState({
			keyboardHeight: 0
		});
	}

	_sendMessage() {

	}

	render() {
		return (
				<View {...this.props}>
					<View style={styles.container}>
						<GrowingTextInput
							ref={c => this.input = c}
							style={styles.inputContainer}
							inputStyle={styles.inputStyle}
							underlineColorAndroid="transparent"
							placeholder="Type a message"
							numberOfLines={5}
						/>
						<TouchableHighlight onPress={this._sendMessage.bind(this)} underlayColor="rgba(0, 0, 0, .16)">
							<View style={styles.iconContainer}>
								<Image
									source={require("image!ic_send_black")}
									style={styles.icon}
								/>
							</View>
						</TouchableHighlight>
					</View>
					<View style={{ height: this.state.keyboardHeight }} />
				</View>
		);
	}
}
