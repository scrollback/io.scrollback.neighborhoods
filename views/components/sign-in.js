import React from "react-native";
import LargeButton from "./large-button";
import GoogleLogin from "../../modules/google-login";
import FacebookLogin from "../../modules/facebook-login";

const {
	StyleSheet,
	View,
	Text,
	Image
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		alignItems: "stretch"
	},
	cover: {
		flex: 1,
		width: null,
		height: null
	},
	overlay: {
		flex: 1,
		alignItems: "stretch",
		padding: 32,
		backgroundColor: "rgba(0, 0, 0, 0.5)"
	},
	image: {
		resizeMode: "contain",
		margin: 4
	},
	imageLogo: {
		height: 59,
		width: 108
	},
	imageLogoType: {
		height: 35,
		width: 219
	},
	logoContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		margin: 16
	},
	tip: {
		color: "#fff",
		textAlign: "center",
		paddingHorizontal: 4,
		marginVertical: 8
	},
	buttonContainer: {
		alignItems: "stretch"
	},
	facebook: {
		backgroundColor: "#3B5998"
	},
	google: {
		backgroundColor: "#488EF1"
	}
});

export default class SignIn extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			googleLoading: false,
			facebookLoading: false
		};
	}

	_onSignIn(e) {
		this.props.signIn(e.provider, e.token);
	}

	_onSignUp() {

	}

	_onFacebookPress() {
		this.setState({
			facebookLoading: true
		});

		FacebookLogin.pickAccount(e => this._onSignIn(e));
	}

	_onGooglePress() {
		this.setState({
			googleLoading: true
		});

		GoogleLogin.pickAccount(e => this._onSignIn(e));
	}

	render() {
		return (
			<View style={styles.container}>
				<Image source={require("image!signin_bg")} style={styles.cover}>
					<View style={styles.overlay}>
						<View style={styles.logoContainer}>
							<Image source={require("image!logo")} style={[ styles.image, styles.imageLogo ]} />
							<Image source={require("image!logotype")} style={[ styles.image, styles.imageLogoType ]} />
						</View>
						<View style={styles.buttonContainer}>
							<Text style={styles.tip}>SIGN IN OR SIGN UP WITH</Text>
							<LargeButton
								style={styles.facebook}
								spinner={this.state.facebookLoading}
								disabled={this.state.facebookLoading}
								text={this.state.facebookLoading ? "" : "Facebook"}
								onPress={this._onFacebookPress.bind(this)}
							/>
							<LargeButton
								style={styles.google}
								spinner={this.state.googleLoading}
								disabled={this.state.googleLoading}
								text={this.state.googleLoading ? "" : "Google"}
								onPress={this._onGooglePress.bind(this)}
							/>
						</View>
					</View>
				</Image>
			</View>
		);
	}
}

SignIn.propTypes = {
	navigator: React.PropTypes.object.isRequired,
	initialRoute: React.PropTypes.object,
	signIn: React.PropTypes.func.isRequired
};
