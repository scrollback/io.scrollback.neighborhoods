import React from "react-native";
import SignInButton from "./sign-in-button";
import Home from "./home";
import GoogleLogin from "../../modules/google-login";
import FacebookLogin from "../../modules/facebook-login";

const {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions
} = React;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cover: {
        flex: 1
    },
    overlay: {
        flex: 1,
        alignItems: "stretch",
        justifyContent: "center",
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
        marginTop: 96
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
    _onSignIn(e) {
        console.log(e);

        this.props.navigator.replace({ component: Home });
    }

    _onSignUp() {

    }

    _onFacebookPress() {
        FacebookLogin.pickAccount(e => this._onSignIn(e));
    }

    _onGooglePress() {
        GoogleLogin.pickAccount(e => this._onSignIn(e));
    }

    render() {
        const win = Dimensions.get("window");

        return (
            <View style={styles.container}>
                <Image source={require("image!signin_bg")} style={[ styles.cover, { height: win.height, width: win.width } ]}>
                    <View style={styles.overlay}>
                        <View style={styles.logoContainer}>
                            <Image source={require("image!logo")} style={[ styles.image, styles.imageLogo ]} />
                            <Image source={require("image!logotype")} style={[ styles.image, styles.imageLogoType ]} />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Text style={styles.tip}>SIGN IN OR SIGN UP WITH</Text>
                            <SignInButton
                                style={styles.facebook}
                                text="Facebook"
                                onPress={this._onFacebookPress.bind(this)}
                            />
                            <SignInButton
                                style={styles.google}
                                text="Google"
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
    navigator: React.PropTypes.object.isRequired
};
