/* @flow */

import React from "react-native";
import AppText from "../AppText";
import LargeButton from "./LargeButton";
import GoogleLogin from "../../modules/GoogleLogin";
import Facebook from "../../modules/Facebook";
import Colors from "../../../Colors.json";

const {
	StyleSheet,
	View,
	Image
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		alignItems: "stretch",
		backgroundColor: Colors.primary
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

const PROVIDER_GOOGLE = "google";
const PROVIDER_FACEBOOK = "facebook";
const PERMISSION_PUBLIC_PROFILE = "public_profile";
const PERMISSION_EMAIL = "email";

type State = {
	googleLoading: boolean;
	facebookLoading: boolean;
}

export default class SignIn extends React.Component {
	state: State = {
		googleLoading: false,
		facebookLoading: false
	};

	_onSignInSuccess = (provider: string, token: string) => {
		this.props.signIn({ provider, token });
	};

	_onSignInFailure = (provider: string) => {
		switch (provider) {
		case PROVIDER_GOOGLE:
			this.setState({
				googleLoading: false
			});
			break;
		case PROVIDER_FACEBOOK:
			this.setState({
				facebookLoading: false
			});
			break;
		}
	};

	_signInWithFacebook = async (): Promise => {
		try {
			const result = await Facebook.logInWithReadPermissions([ PERMISSION_PUBLIC_PROFILE, PERMISSION_EMAIL ]);

			const {
				permissions_granted,
				token
			} = result;

			if (permissions_granted.length && permissions_granted.indexOf(PERMISSION_PUBLIC_PROFILE) > -1 && permissions_granted.indexOf(PERMISSION_EMAIL) > -1) {
				this._onSignInSuccess(PROVIDER_FACEBOOK, token);
			} else {
				this._onSignInFailure(PROVIDER_FACEBOOK);
			}
		} catch (e) {
			this._onSignInFailure(PROVIDER_FACEBOOK);
		}
	};

	_signInWithGoogle = async (): Promise => {
		try {
			const result = await GoogleLogin.logIn();

			this._onSignInSuccess(PROVIDER_GOOGLE, result.token);
		} catch (e) {
			this._onSignInFailure(PROVIDER_GOOGLE);
		}
	};

	_onFacebookPress = () => {
		this.setState({
			facebookLoading: true
		});

		requestAnimationFrame(() => this._signInWithFacebook());
	};

	_onGooglePress = () => {
		this.setState({
			googleLoading: true
		});

		requestAnimationFrame(() => this._signInWithGoogle());
	};

	render() {
		return (
			<View style={styles.container}>
				<Image source={require("../../../assets/signin_bg.jpg")} style={styles.cover}>
					<View style={styles.overlay}>
						<View style={styles.logoContainer}>
							<Image source={require("../../../assets/logo.png")} style={[ styles.image, styles.imageLogo ]} />
							<Image source={require("../../../assets/logotype.png")} style={[ styles.image, styles.imageLogoType ]} />
						</View>
						<View style={styles.buttonContainer}>
							<AppText style={styles.tip}>SIGN IN OR SIGN UP WITH</AppText>
							<LargeButton
								style={styles.facebook}
								spinner={this.state.facebookLoading}
								disabled={this.state.facebookLoading}
								label={this.state.facebookLoading ? "" : "Facebook"}
								onPress={this._onFacebookPress}
							/>
							<LargeButton
								style={styles.google}
								spinner={this.state.googleLoading}
								disabled={this.state.googleLoading}
								label={this.state.googleLoading ? "" : "Google"}
								onPress={this._onGooglePress}
							/>
						</View>
					</View>
				</Image>
			</View>
		);
	}
}

SignIn.propTypes = {
	signIn: React.PropTypes.func.isRequired
};
