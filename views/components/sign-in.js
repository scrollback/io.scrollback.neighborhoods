import React from "react-native";
import SignInButton from "./sign-in-button";
import Home from "./home";
import GoogleLogin from "../../modules/google-login";

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
        flex: 1,
        resizeMode: "cover"
    },
    overlay: {
        flex: 1,
        alignItems: "stretch",
        justifyContent: "center",
        padding: 32,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    image: {
        resizeMode: "contain"
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
    _onSignIn() {
        this.props.navigator.replace({ component: Home });
    }

    _onSignUp() {

    }

    _onFacebookPress() {
        this._onSignIn();
    }

    _onGooglePress() {
        GoogleLogin.login();
    }

    render() {
        const win = Dimensions.get("window");

        return (
            <View style={styles.container}>
                <Image source={require("image!signin_bg")} style={[ styles.cover, { height: win.height, width: win.width } ]}>
                    <View style={styles.overlay}>
                        <View style={styles.logoContainer}>
                            <Image source={require("image!logo")} style={styles.image} />
                            <Image source={require("image!logotype")} style={styles.image} />
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
