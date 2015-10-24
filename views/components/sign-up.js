import React from "react-native";
import AppbarTouchable from "./appbar-touchable";
import AppbarIcon from "./appbar-icon";
import KeyboardSpacer from "./keyboard-spacer";
import Icon from "./icon";
import Banner from "./banner";
import DeviceVersion from "../../modules/device-version";
import Validator from "../../lib/validator";

const {
	StyleSheet,
	PixelRatio,
	TouchableHighlight,
	Image,
	ScrollView,
	View,
	Text,
	TextInput
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	statusbar: {
		height: DeviceVersion.VERSION_SDK_INT < DeviceVersion.VERSION_CODES_KITKAT ? 0 : 25 // offset for statusbar height
	},
	appbar: {
		flexDirection: "row",
		height: 56,
		borderColor: "rgba(0, 0, 0, .16)",
		borderBottomWidth: 1 / PixelRatio.get(),
		paddingHorizontal: 4
	},
	titleText: {
		color: "#555",
		fontWeight: "bold",
		fontSize: 18,
		marginVertical: 14,
		marginRight: 64,
		paddingHorizontal: 4,
		marginHorizontal: 4
	},
	icon: {
		color: "#555"
	},
	scene: {
		padding: 24
	},
	sceneContainer: {
		alignItems: "center",
		justifyContent: "center"
	},
	avatar: {
		height: 96,
		width: 96,
		borderRadius: 48,
		marginVertical: 12
	},
	heading: {
		color: "#555",
		fontSize: 24,
		lineHeight: 36,
		textAlign: "center",
		marginVertical: 8,
		paddingHorizontal: 4
	},
	paragraph: {
		color: "#555",
		fontSize: 16,
		lineHeight: 24,
		textAlign: "center",
		marginVertical: 8,
		paddingHorizontal: 4
	},
	hint: {
		color: "#999",
		textAlign: "center",
		fontSize: 12,
		lineHeight: 18,
		marginTop: 8
	},
	error: {
		color: "#f44336"
	},
	buttonContainer: {
		height: 56,
		width: 56,
		borderRadius: 28,
		marginVertical: 36
	},
	button: {
		backgroundColor: "#4CAF50",
		height: 56,
		width: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center"
	},
	buttonText: {
		color: "#fff",
		fontSize: 24,
		textAlign: "center"
	}
});

export default class SignUp extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: "",
			error: null,
			errorMessage: null
		};
	}

	async _signUp() {
		if (this.state.error) {
			return;
		}

		if (!this.state.value) {
			this.setState({
				errorMessage: "Enter a name first"
			});

			return;
		}

		try {
			await this.props.signUp(this.state.value);
		} catch (err) {
			this.setState({
				errorMessage: err.message
			});
		}
	}

	_onChange(e) {
		const value = e.nativeEvent.text.toLowerCase();

		let error;

		const validation = new Validator(value);

		if (!validation.isValid()) {
			error = { [validation.error]: true };
		}

		this.setState({
			value,
			error,
			errorMessage: null
		});
	}

	render() {
		const { user } = this.props;
		const { error } = this.state;

		return (
			<View style={styles.container}>
				<View style={styles.statusbar} />

				<View style={styles.appbar}>
					<AppbarTouchable onPress={this.props.cancelSignUp}>
						<AppbarIcon name="arrow-back" style={styles.icon} />
					</AppbarTouchable>

					<View>
						<Text style={styles.titleText}>Let's create an account</Text>
					</View>
				</View>

				<Banner text={this.state.errorMessage} type="error" />

				<ScrollView style={styles.scene}>
					<View style={styles.sceneContainer}>
						<Text style={styles.heading}>Hey there!</Text>

						<Image
							style={styles.avatar}
							source={{ uri: user.params.pictures[0] }}
						/>

						<Text style={styles.paragraph}>New here? Tell us what to call you.</Text>

						<Text style={styles.hint}>
							<Text style={error && error.ERR_VALIDATE_CHARS ? styles.error : null}>Letters, numbers and hyphens, no spaces. </Text>
							<Text style={error && error.ERR_VALIDATE_START ? styles.error : null}>Cannot start with a hyphen. </Text>
							<Text style={error && error.ERR_VALIDATE_NO_ONLY_NUMS ? styles.error : null}>Should have at least 1 letter. </Text>
							<Text style={error && (error.ERR_VALIDATE_LENGTH_SHORT || error.ERR_VALIDATE_LENGTH_LONG) ? styles.error : null}>(3-32 characters)</Text>
						</Text>

						<TextInput
							value={this.state.value}
							onChange={this._onChange.bind(this)}
							style={styles.input}
							autoCorrect={false}
							maxLength={32}
							placeholder="Choose your awesome nickname"
							textAlign="center"
							placeholderTextColor="#aaa"
							underlineColorAndroid={error ? "#f44336" : "#673ab7"}
						/>

						<TouchableHighlight style={styles.buttonContainer} onPress={this._signUp.bind(this)}>
							<View style={styles.button}>
								<Icon name="arrow-forward" style={styles.buttonText} />
							</View>
						</TouchableHighlight>
					</View>
				</ScrollView>

				<KeyboardSpacer />
			</View>
		);
	}
}

SignUp.propTypes = {
	user: React.PropTypes.shape({
		params: React.PropTypes.shape({
			pictures: React.PropTypes.arrayOf(React.PropTypes.string)
		})
	}),
	signUp: React.PropTypes.func.isRequired,
	cancelSignUp: React.PropTypes.func.isRequired
};
