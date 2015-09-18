import React from "react-native";
import Card from "./card";
import CardTitle from "./card-title";
import CardSummary from "./card-summary";
import CardHashtags from "./card-hashtags";
import DiscussionFooter from "./discussion-footer";
import Author from "./author";
import Embed from "./embed";
import Chat from "./chat";
import text from "../lib/text";
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

export default class Discussion extends React.Component {
    render() {
        const { thread } = this.props;

        const processedText = text.format(thread.text);

        let cover;

        if (processedText.pictures.length) {
            cover = <Image style={styles.image} source={{ uri: processedText.pictures[0] }} />;
        } else if (processedText.links.length) {
            const uri = processedText.links[0],
                  endpoint = oembed(uri);

            if (endpoint) {
                cover = <Embed uri={uri} endpoint={endpoint} />;
            }
        }

        return (
            <Card {...this.props}>
                <TouchableNativeFeedback>
                    <View>
                        {cover}

                        <CardTitle style={[
                            styles.item,
                            cover ? { marginTop: 8 } : { marginTop: 16 }
                        ]} text={this.props.thread.title} />

                        {cover ? null :
                            <CardSummary style={styles.item} text={thread.text.trim()} />
                        }

                        {processedText.hashtags.length ?
                            <CardHashtags style={styles.item} hashtags={processedText.hashtags} /> :
                            null
                        }

                        <Author style={[ styles.item, styles.author ]} nick={thread.from} />

                        <DiscussionFooter style={[ styles.item, styles.footer ]} thread={thread} />
                    </View>
                </TouchableNativeFeedback>
            </Card>
        );
    }
}

Discussion.propTypes = {
    thread: React.PropTypes.shape({
        picture: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        text: React.PropTypes.string.isRequired,
        from: React.PropTypes.string.isRequired,
        tags: React.PropTypes.arrayOf(React.PropTypes.string),
        labels: React.PropTypes.arrayOf(React.PropTypes.string)
    }).isRequired
};
