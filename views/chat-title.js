import React from "react-native";

const {
    StyleSheet,
    View,
    Text
} = React;

const styles = StyleSheet.create({
    container: {
        marginVertical: 8
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        paddingHorizontal: 4
    },
    subtitle: {
        color: "rgba(255, 255, 255, .5)",
        fontSize: 12
    }
});

export default class ChatTitle extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text numberOfLines={1} style={styles.title}>
                    {this.props.thread.title}
                </Text>
                <Text numberOfLines={1} style={styles.subtitle}>
                    {this.props.thread.concerns.length || 1} people talking
                </Text>
            </View>
        );
    }
}

ChatTitle.propTypes = {
    thread: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        concerns: React.PropTypes.arrayOf(React.PropTypes.string)
    }).isRequired
};
