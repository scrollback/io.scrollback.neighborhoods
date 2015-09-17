import React from "react-native";
import time from "../lib/time";

const {
    StyleSheet,
    Text,
    View,
    Image
} = React;

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        paddingTop: 8,
        borderColor: "rgba(0, 0, 0, .1)",
        borderTopWidth: 1
    },
    info: {
        flexDirection: "row"
    },
    label: {
        color: "#999",
        fontSize: 12,
        marginLeft: 4,
        marginRight: 16
    },
    icon: {
        height: 22,
        width: 22,
        resizeMode: "contain"
    }
});

export default class DiscussionFooter extends React.Component {
    render() {
        return (
            <View {...this.props} style={[ styles.footer, this.props.style ]}>
                <View style={styles.info}>
                    <Image style={styles.icon} source={require("image!ic_history")} />
                    <Text style={styles.label}>{time(this.props.thread.updateTime)}</Text>
                </View>
                <View style={styles.info}>
                    <Image style={styles.icon} source={require("image!ic_people")} />
                    <Text style={styles.label}>{this.props.thread.concerns ? this.props.thread.concerns.length : 1} people</Text>
                </View>
                <View style={styles.info}>
                    <Image style={styles.icon} source={require("image!ic_messages")} />
                    <Text style={styles.label}>{this.props.thread.length} messages</Text>
                </View>
            </View>
        );
    }
}

DiscussionFooter.propTypes = {
    thread: React.PropTypes.shape({
        updateTime: React.PropTypes.number.isRequired,
        concerns: React.PropTypes.array.isRequired,
        length: React.PropTypes.number.isRequired
    }).isRequired
};
