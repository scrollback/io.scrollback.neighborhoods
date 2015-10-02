import React from "react-native";

const {
    StyleSheet,
    Text,
    View,
    Image
} = React;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#673AB7"
    },
    logo: {
        flex: 1,
        resizeMode: "contain",
        marginTop: 96
    },
    attribution: {
        alignItems: "center",
        alignSelf: "stretch",
        margin: 16
    },
    by: {
        color: "rgba(255, 255, 255, .5)",
        paddingHorizontal: 4
    },
    scrollback: {
        resizeMode: "contain"
    }
});

export default class Splash extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Image style={styles.logo} source={require("image!logo")} />
                <View style={styles.attribution}>
                    <Text style={styles.by}>by</Text>
                    <Image style={styles.scrollback} source={require("image!scrollback_logo")} />
                </View>
            </View>
        );
    }
}
