import React from "react-native";
import ChatBubble from "./chat-bubble";
import Avatar from "./avatar";
import Embed from "./embed";
import Modal from "./modal";
import textUtils from "../../lib/text-utils";
import timeUtils from "../../lib/time-utils";
import oembed from "../../lib/oembed";

const {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Image
} = React;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
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
        top: 0,
        left: -36,
        height: 36,
        width: 36,
        borderRadius: 18,
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
    },
    bubbleReceived: {
        marginRight: 8
    },
    bubbleSent: {
        marginLeft: 8
    }
});

export default class ChatItem extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (
                this.props.text.text !== nextProps.text.text ||
                this.props.text.from !== nextProps.text.from ||
                this.props.text.time !== nextProps.text.time ||
                this.props.previousText.from !== nextProps.previousText.from ||
                this.props.previousText.time !== nextProps.previousText.time
            );
    }

    _showMenu() {
        const options = [ "Copy text", "Reply", "Quote" ];

        Modal.showActionSheetWithOptions({ options }, () => {});
    }

    render() {
        const { text, previousText } = this.props;

        const received = text.from !== "miracleonreathrth";

        const links = textUtils.getLinks(text.text);
        const pictures = textUtils.getPictures(text.text);

        let cover;

        if (pictures.length) {
            cover = <Image style={null} source={{ uri: pictures[0] }} />;
        } else if (links.length) {
            const uri = links[0];
            const endpoint = oembed(uri);

            if (endpoint) {
                cover = (
                    <Embed
                        uri={uri}
                        endpoint={endpoint}
                        style={styles.embed}
                    />
                );
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
                    {received && showAuthor ?
                        <View style={styles.avatar}>
                            <Avatar
                                size={48}
                                nick={text.from}
                                style={styles.image}
                            />
                        </View> :
                        null
                    }

                    <TouchableOpacity onPress={this._showMenu.bind(this)}>
                        <ChatBubble
                            text={text}
                            type={received ? "left" : "right"}
                            showAuthor={showAuthor}
                            showArrow={received ? showAuthor : true}
                            style={received ? styles.bubbleReceived : styles.bubbleSent}
                        >
                            {cover}
                        </ChatBubble>
                    </TouchableOpacity>
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
