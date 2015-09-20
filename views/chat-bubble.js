import React from "react-native";
import RichText from "./rich-text";

const {
    StyleSheet,
    View,
    Text,
    Image
} = React;

const styles = StyleSheet.create({
    containerLeft: {
        alignItems: "flex-start"
    },
    containerRight: {
        alignItems: "flex-end"
    },
    bubble: {
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 3
    },
    text: {
        paddingHorizontal: 4
    },
    triangle: {
        position: "absolute",
        height: 12,
        width: 10
    },
    triangleLeft: {
        top: 0,
        left: -8
    },
    triangleRight: {
        right: -8,
        bottom: 0
    },
    author: {
        fontSize: 12,
        paddingBottom: 4,
        opacity: 0.5
    }
});

export default class ChatBubble extends React.Component {
    render() {
        const { text } = this.props;

        const right = this.props.type === "right";

        return (
            <View style={right ? styles.containerRight : styles.containerLeft}>
                {right ? null :
                    <Image style={[ styles.triangle, styles.triangleLeft ]} source={require("image!triangle_left")} />
                }
                <View style={styles.bubble}>
                    {this.props.showAuthor ?
                        <Text style={styles.author}>{text.from}</Text> :
                        null
                    }
                    {this.props.children}
                    <RichText text={text.text} style={styles.text} />
                </View>
                {right ?
                    <Image style={[ styles.triangle, styles.triangleRight ]} source={require("image!triangle_right")} /> :
                    null
                }
            </View>
        );
    }
}

ChatBubble.defaultProps = {
    showAuthor: false
};

ChatBubble.propTypes = {
    text: React.PropTypes.shape({
        text: React.PropTypes.string.isRequired,
        from: React.PropTypes.string.isRequired
    }).isRequired,
    type: React.PropTypes.oneOf([ "left", "right" ]),
    showAuthor: React.PropTypes.bool,
    children: React.PropTypes.any
};
