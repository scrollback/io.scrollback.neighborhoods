import React from "react-native";
import Avatar from "./avatar";
import routes from "../utils/routes";

const {
    StyleSheet,
    TouchableHighlight,
    View
} = React;

const styles = StyleSheet.create({
    avatar: {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: "#999",
        borderColor: "#fff",
        borderWidth: 2,
        margin: 16
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 12
    }
});

export default class UserIcon extends React.Component {
    _onPress() {
        global.requestAnimationFrame(() => this.props.navigator.push(routes.account()));
    }

    render() {
        return (
            <TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" onPress={this._onPress.bind(this)}>
                <View style={styles.avatar}>
                    <Avatar
                        size={24}
                        nick={this.props.nick}
                        style={styles.image}
                    />
                </View>
            </TouchableHighlight>
        );
    }
}

UserIcon.propTypes = {
    nick: React.PropTypes.string.isRequired,
    navigator: React.PropTypes.object.isRequired
};
