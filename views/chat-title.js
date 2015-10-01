import React from "react-native";

const {
    StyleSheet,
    TouchableHighlight,
    View,
    Text
} = React;

const styles = StyleSheet.create({
    container: {
        marginRight: 64,
        paddingVertical: 10
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14
    },
    subtitle: {
        color: "rgba(255, 255, 255, .5)",
        fontSize: 12
    }
});

export default class ChatTitle extends React.Component {
    render() {
        const { thread } = this.props;

        let title = "…",
            concerns = 1;

        if (thread && thread.title) {
            title = thread.title;
            concerns = thread.concerns.length || 1;
        } else if (thread === "LOADING") {
            title = "Loading…";
        }

        return (
            <TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" style={styles.container}>
                <View>
                    <Text numberOfLines={1} style={styles.title}>
                        {title}
                    </Text>
                    <Text numberOfLines={1} style={styles.subtitle}>
                        {concerns} {concerns > 1 ? " people" : " person"} talking
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }
}

ChatTitle.propTypes = {
    thread: React.PropTypes.oneOfType([
        React.PropTypes.shape({
            title: React.PropTypes.string.isRequired,
            concerns: React.PropTypes.arrayOf(React.PropTypes.string)
        }),
        React.PropTypes.string
    ]).isRequired
};
