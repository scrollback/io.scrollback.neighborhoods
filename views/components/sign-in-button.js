import React from "react-native";
import TouchFeedback from "./touch-feedback";

const {
    StyleSheet,
    View,
    Text
} = React;

const styles = StyleSheet.create({
    container: {
        marginVertical: 16
    },
    button: {
        padding: 12,
        borderRadius: 3
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        paddingHorizontal: 4
    }
});

export default class SignInButton extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <TouchFeedback underlayColor="rgba(0, 0, 0, .16)" onPress={this.props.onPress}>
                    <View style={[ styles.button, this.props.style ]}>
                        <Text style={styles.buttonText}>{this.props.text.toUpperCase()}</Text>
                    </View>
                </TouchFeedback>
            </View>
        );
    }
}

SignInButton.propTypes = {
    text: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func.isRequired
};
