import React from "react-native";
import Avatar from "./avatar";

const {
    StyleSheet,
    View
} = React;

const styles = StyleSheet.create({
    avatar: {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: "#999",
        borderColor: "#fff",
        borderWidth: 2,
        margin: 16
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 12
    }
});

export default class UserIcon extends React.Component {
    render() {
        return (
            <View style={styles.avatar}>
                <Avatar
                    size={24}
                    nick="satya164"
                    style={styles.image}
                />
            </View>
        );
    }
}
