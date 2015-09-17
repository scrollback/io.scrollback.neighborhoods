import React from "react-native";
import time from "../lib/time";

const {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} = React;

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        paddingTop: 8,
        borderColor: "rgba(0, 0, 0, .1)",
        borderTopWidth: 1
    },
    left: {
        flex: 1,
        flexDirection: "row",
        alignSelf: "flex-start"
    },
    right: {
        flexDirection: "row",
        alignSelf: "flex-end"
    },
    info: {
        flexDirection: "row",
        alignItems: "center"
    },
    label: {
        color: "#000",
        fontSize: 12,
        marginLeft: 8,
        marginRight: 16
    },
    action: {
        fontWeight: "bold"
    },
    icon: {
        height: 24,
        width: 24,
        resizeMode: "contain"
    },
    faded: {
        opacity: 0.5
    }
});

export default class DiscussionFooter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loved: Math.random() > 0.5,
            num: Math.round(Math.random() * 10) + 1
        };
    }

    onHeart() {
        this.setState({
            loved: !this.state.loved,
            num: this.state.loved ? (this.state.num - 1) : (this.state.num + 1)
        });
    }

    render() {
        return (
            <View {...this.props} style={[ styles.footer, this.props.style ]}>
                <View style={styles.left}>
                    <TouchableHighlight underlayColor="#fff" onPress={this.onHeart.bind(this)}>
                        <View style={styles.info}>
                            <Image style={styles.icon} source={this.state.loved ? require("image!ic_heart_colored") : require("image!ic_heart_empty")} />
                            <Text style={[ styles.label, styles.action ]}>{this.state.num}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={styles.right}>
                    <View style={[ styles.info, styles.faded ]}>
                        <Image style={styles.icon} source={require("image!ic_history")} />
                        <Text style={styles.label}>{time(this.props.thread.updateTime)}</Text>
                    </View>
                    <View style={[ styles.info, styles.faded ]}>
                        <Image style={styles.icon} source={require("image!ic_people")} />
                        <Text style={styles.label}>{this.props.thread.concerns ? this.props.thread.concerns.length : 1}</Text>
                    </View>
                    <View style={[ styles.info, styles.faded ]}>
                        <Image style={styles.icon} source={require("image!ic_forum")} />
                        <Text style={styles.label}>{this.props.thread.length}</Text>
                    </View>
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
