import React from "react-native";
import ChatController from "./chat-controller";
import Card from "./card";
import CardTitle from "./card-title";
import CardSummary from "./card-summary";
import CardHashtags from "./card-hashtags";
import CardAuthor from "./card-author";
import DiscussionFooter from "./discussion-footer";
import Embed from "./embed";
import textUtils from "../lib/text-utils";
import oembed from "../lib/oembed";

const {
    StyleSheet,
    Image,
    View,
    TouchableNativeFeedback
} = React;

const styles = StyleSheet.create({
    image: {
        resizeMode: "cover",
        height: 160
    },
    author: { marginVertical: 8 },
    item: { marginHorizontal: 16 },
    footer: { marginBottom: 8 }
});

export default class DiscussionItem extends React.Component {
    _onPress() {
        this.props.navigator.push({
            title: this.props.thread.title,
            component: ChatController
        });
    }

    shouldComponentUpdate(nextProps) {
        return (
                this.props.thread.title !== nextProps.thread.title ||
                this.props.thread.text !== nextProps.thread.text ||
                this.props.thread.from !== nextProps.thread.from
            );
    }

    render() {
        const { thread } = this.props;

        let trimmedText = thread.text.trim();

        const hashtags = textUtils.getHashtags(trimmedText);
        const links = textUtils.getLinks(trimmedText);
        const pictures = textUtils.getPictures(trimmedText);

        let cover;

        if (pictures.length) {
            cover = <Image style={styles.image} source={{ uri: pictures[0] }} />;
        } else if (links.length) {
            const uri = links[0];
            const endpoint = oembed(uri);

            if (endpoint) {
                cover = <Embed uri={uri} endpoint={endpoint} />;
            }
        }

        return (
            <Card {...this.props}>
                <TouchableNativeFeedback onPress={this._onPress.bind(this)}>
                    <View>
                        {cover}

                        <CardTitle style={[
                            styles.item,
                            cover ? { marginTop: 8 } : { marginTop: 16 }
                        ]} text={this.props.thread.title} />

                        {cover ? null :
                            <CardSummary style={styles.item} text={trimmedText} />
                        }

                        {hashtags.length ?
                            <CardHashtags style={styles.item} hashtags={hashtags} /> :
                            null
                        }

                        <CardAuthor style={[ styles.item, styles.author ]} nick={thread.from} />

                        <DiscussionFooter style={[ styles.item, styles.footer ]} thread={thread} />
                    </View>
                </TouchableNativeFeedback>
            </Card>
        );
    }
}

DiscussionItem.propTypes = {
    thread: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired,
        from: React.PropTypes.string.isRequired
    }).isRequired
};
