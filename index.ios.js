import React from "react-native";

const {
    AppRegistry,
    StyleSheet,
    Text,
    View
} = React;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    welcome: {
        fontSize: 20,
        textAlign: "center",
        margin: 10
    },
    instructions: {
        textAlign: "center",
        color: "#333333",
        marginBottom: 5
    }
});

class HeyNeighbor extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Hey there!
                </Text>
                <Text style={styles.instructions}>
                    iOS version is not implemented yet ;(
                </Text>
            </View>
        );
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
