import React from "react-native";
import ChatBubble from "./chat-bubble";
import Avatar from "./avatar";
import Embed from "./embed";
import textUtils from "../lib/text-utils";
import timeUtils from "../lib/time-utils";
import oembed from "../lib/oembed";

const {
    StyleSheet,
    View,
    Text,
    Image
} = React;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 4
    },
    chat: {
        flex: 0,
        flexDirection: "column",
        alignItems: "flex-end"
    },
    received: {
        alignItems: "flex-start",
        marginLeft: 44
    },
    timestamp: {
        fontSize: 12,
        marginTop: 4,
        paddingHorizontal: 8,
        opacity: 0.5
    },
    timestampLeft: { marginLeft: 52 },
    timestampRight: { alignSelf: "flex-end" },
    avatar: {
        position: "absolute",
        left: -44,
        top: 0,
        height: 36,
        width: 36,
        borderRadius: 18,
        marginRight: 4,
        backgroundColor: "#999",
        alignSelf: "flex-end"
    },
    embed: {
        width: 240,
        height: 160,
        marginVertical: 4
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 36
    }
});

export default class ChatItem extends React.Component {
    render() {
        const { text, previousText } = this.props;

        const received = Math.random() < 0.7;

        const links = textUtils.getLinks(text.text);
        const pictures = textUtils.getPictures(text.text);

        let cover;

        if (pictures.length) {
            cover = <Image style={null} source={{ uri: pictures[0] }} />;
        } else if (links.length) {
            const uri = links[0];
            const endpoint = oembed(uri);

            if (endpoint) {
                cover = <Embed uri={uri} endpoint={endpoint} style={styles.embed} />;
            }
        }

        let showAuthor = received,
            showTime = false;

        if (previousText) {
            if (received) {
                showAuthor = text.from !== previousText.from;
            }

            showTime = (text.time - previousText.time) > 300000;
        }

        return (
            <View {...this.props} style={[ styles.container, this.props.style ]}>
                <View style={[ styles.chat, received ? styles.received : null ]}>
                    {received ?
                        <View style={styles.avatar}>
                            <Avatar nick={text.from} size={48} style={styles.image} />
                        </View> :
                        null
                    }
                    <ChatBubble text={text} type={received ? "left" : "right"} showAuthor={showAuthor} style={styles.bubble}>
                        {cover}
                    </ChatBubble>
                </View>
                {showTime ?
                    <Text style={[ styles.timestamp, received ? styles.timestampLeft : styles.timestampRight ]}>{timeUtils.long(text.time)}</Text> :
                    null
                }
            </View>
        );
    }
}

ChatItem.propTypes = {
    text: React.PropTypes.shape({
        text: React.PropTypes.string.isRequired,
        from: React.PropTypes.string.isRequired,
        time: React.PropTypes.number.isRequired
    }).isRequired,
    previousText: React.PropTypes.shape({
        from: React.PropTypes.string.isRequired,
        time: React.PropTypes.number.isRequired
    })
};
