import React from "react-native";
import Colors from "../../colors.json";
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
		backgroundColor: Colors.fadedBlack
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
		color: Colors.white,
		textAlign: "center",
		paddingHorizontal: 4,
		marginVertical: 8
	},
	buttonContainer: {
		alignItems: "stretch"
	},
	facebook: {
		backgroundColor: Colors.facebook
	},
	google: {
		backgroundColor: Colors.google
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

	_onSignInSuccess(e) {
		this.props.signIn(e.provider, e.token);
	}

	_onSignInFailure(e) {
		switch (e.provider) {
		case "google":
			this.setState({
				googleLoading: false
			});
			break;
		case "facebook":
			this.setState({
				facebookLoading: false
			});
			break;
		}
	}

	async _signInWithFacebook() {
		try {
			const result = await FacebookLogin.logIn();

			this._onSignInSuccess(result);
		} catch (e) {
			this._onSignInFailure(e);
		}
	}

	async _signInWithGoogle() {
		try {
			const result = await GoogleLogin.logIn();

			this._onSignInSuccess(result);
		} catch (e) {
			this._onSignInFailure(e);
		}
	}

	_onFacebookPress() {
		this.setState({
			facebookLoading: true
		});

		this._signInWithFacebook();
	}

	_onGooglePress() {
		this.setState({
			googleLoading: true
		});

		this._signInWithGoogle();
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
