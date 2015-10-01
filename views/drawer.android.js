import React from "react-native";

const {
    StyleSheet,
    View,
    Text
} = React;

const styles = StyleSheet.create({
    drawer: {
        flex: 1,
        backgroundColor: "#fff"
    }
});

export default class Drawer extends React.Component {
    render() {
        return (
            <View style={styles.drawer}>
                <Text>I'm in the Drawer!</Text>
            </View>
        );
    }
}
