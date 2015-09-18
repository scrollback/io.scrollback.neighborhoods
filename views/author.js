import React from "react-native";

const {
    StyleSheet,
    Text,
    View,
    Image
} = React;

const styles = StyleSheet.create({
    author: {
        flexDirection: "row",
        alignItems: "center"
    },
    name: {
        flex: 1,
        color: "#999",
        fontSize: 12,
        marginHorizontal: 8
    },
    avatar: {
        height: 16,
        width: 16,
        borderRadius: 8,
        backgroundColor: "#999"
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 8
    }
});

export default class CardAuthor extends React.Component {
    render() {
        const { nick } = this.props;

        return (
            <View {...this.props} style={[ styles.author, this.props.style ]}>
                <View style={styles.avatar}>
                    <Image source={{ uri: "http://scrollback.io/i/" + nick + "/picture" }} style={styles.image} />
                </View>
                <Text style={styles.name}>{nick}</Text>
            </View>
        );
    }
}

CardAuthor.propTypes = {
    nick: React.PropTypes.string.isRequired
};
