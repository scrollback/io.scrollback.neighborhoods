import React from "react-native";
import Avatar from "./avatar";
import TouchFeedback from "./touch-feedback";
import routes from "./routes";
import timeUtils from "../lib/time-utils";

const {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableHighlight
} = React;

const styles = StyleSheet.create({
    item: {
        borderColor: "rgba(0, 0, 0, .04)",
        borderBottomWidth: 1
    },
    note: {
        flexDirection: "row"
    },
    avatar: {
        height: 36,
        width: 36,
        borderRadius: 18,
        backgroundColor: "#999",
        marginHorizontal: 8,
        marginVertical: 12
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 18
    },
    content: {
        flex: 1,
        margin: 8
    },
    title: {
        lineHeight: 21,
        color: "#888"
    },
    summary: {
        lineHeight: 18,
        fontSize: 12,
        color: "#888"
    },
    strong: {
        color: "#555"
    },
    timestampContainer: {
        flexDirection: "row"
    },
    timestamp: {
        fontSize: 12,
        color: "#aaa",
        marginLeft: 8,
        paddingHorizontal: 4
    },
    icon: {
        height: 14,
        width: 14,
        marginVertical: 2,
        resizeMode: "contain",
        opacity: 0.3
    },
    close: {
        paddingVertical: 12,
        paddingHorizontal: 16
    }
});

export default class NotificationCenterItem extends React.Component {
    _extractPart(note, index) {
        return typeof note.group === "string" ? note.group.split("/")[index] : null;
    }

    _getThread(note) {
        const thread = this._extractPart(note, 1);

        return (thread === "all" || !thread) ? null : thread;
    }

    _getRoom(note) {
        return this._extractPart(note, 0);
    }

    _getSummary(note) {
        const max = 3;

        const { noteData, noteType, count } = note;

        const room = this._getRoom(this.props.note);

        const summary = [];

        switch (noteType) {
        case "mention":
            if (count > max) {
                summary.push(<Text key={1} style={styles.strong}>{count}</Text>, " new mentions in");
            } else {
                summary.push(<Text key={1} style={styles.strong}>{noteData.from}</Text>, " mentioned you in");
            }

            if (noteData.title) {
                summary.push(" ", <Text key={2} style={styles.strong}>{noteData.title}</Text>);
            }

            summary.push(" - ", <Text key={3} style={styles.strong}>{room}</Text>);

            break;
        case "reply":
            if (count > max) {
                summary.push(<Text key={1} style={styles.strong}>{count}</Text>, " new replies");
            } else {
                summary.push(<Text key={1} style={styles.strong}>{noteData.from}</Text>, " replied");
            }

            if (noteData.title) {
                summary.push(" to ", <Text key={2} style={styles.strong}>{noteData.title}</Text>);
            }

            summary.push(" in ", <Text key={3} style={styles.strong}>{room}</Text>);

            break;
        case "thread":
            if (count > max) {
                summary.push(<Text key={1} style={styles.strong}>{count}</Text>, " new discussions");
            } else {
                summary.push(<Text key={1} style={styles.strong}>{noteData.from}</Text>, " started a discussion");

                if (noteData.title) {
                    summary.push(" on ", <Text key={2} style={styles.strong}>{noteData.title}</Text>);
                }
            }

            summary.push(" in ", <Text key={3} style={styles.strong}>{room}</Text>);

            break;
        default:
            if (count > max) {
                summary.push(<Text key={1} style={styles.strong}>{count}</Text>, " new notifications");
            } else {
                summary.push("New notification from ", <Text key={1} style={styles.strong}>{noteData.from}</Text>);
            }

            summary.push(" in ", <Text key={2} style={styles.strong}>{room}</Text>);
        }

        return summary;
    }

    _onPress() {
        const { note, navigator } = this.props;

        const room = this._getRoom(note);
        const thread = this._getThread(note);

        switch (note.noteType) {
        case "mention":
        case "reply":
        case "thread":
            navigator.push(routes.chat({ thread }));

            break;
        default:
            navigator.push(routes.room({ room }));
        }
    }

    render() {
        const { note } = this.props;

        return (
            <View style={styles.item}>
                <TouchFeedback onPress={this._onPress.bind(this)}>
                    <View style={styles.note}>
                        <View style={styles.avatar}>
                            <Avatar
                                size={36}
                                nick={note.noteData.from}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.content}>
                            <View>
                                <Text numberOfLines={5} style={styles.title} >{this._getSummary(note)}</Text>
                            </View>
                            <View>
                                <Text numberOfLines={1} style={styles.summary} >{note.noteData.text}</Text>
                            </View>
                            <View style={styles.timestampContainer}>
                                <Image style={styles.icon} source={require("image!ic_history_black")} />
                                <Text style={styles.timestamp}>{timeUtils.long(note.time)}</Text>
                            </View>
                        </View>
                        <TouchableHighlight underlayColor="rgba(0, 0, 0, .08)">
                            <View style={styles.close}>
                                <Image style={styles.icon} source={require("image!ic_close_black")} />
                            </View>
                        </TouchableHighlight>
                    </View>
                </TouchFeedback>
            </View>
        );
    }
}

NotificationCenterItem.propTypes = {
    note: React.PropTypes.shape({
        count: React.PropTypes.number,
        group: React.PropTypes.string.isRequired,
        noteType: React.PropTypes.string.isRequired,
        noteData: React.PropTypes.shape({
            title: React.PropTypes.string,
            text: React.PropTypes.string.isRequired,
            from: React.PropTypes.string.isRequired
        }).isRequired
    }).isRequired,
    navigator: React.PropTypes.object.isRequired
};
