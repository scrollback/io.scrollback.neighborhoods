import React from "react-native";

const {
    StyleSheet,
    TouchableHighlight,
    View,
    Text,
    Image
} = React;

const styles = StyleSheet.create({
    container: {
        position: "relative"
    },
    icon: {
        height: 24,
        width: 24,
        margin: 16
    },
    badge: {
        position: "absolute",
        top: 8,
        right: 8,
        height: 24,
        width: 24,
        borderRadius: 12,
        paddingVertical: 4,
        backgroundColor: "#E91E63"
    },
    count: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 10,
        textAlign: "center"
    }
});

export default class NotificationIcon extends React.Component {
    render() {
        const { count } = this.props;

        return (
            <View style={styles.container}>
                <TouchableHighlight underlayColor="rgba(0, 0, 0, .16)">
                    <Image source={require("image!ic_notifications_white")} style={styles.icon} />
                </TouchableHighlight>
                {count ?
                    <View style={styles.badge}>
                        <Text style={styles.count}>
                            {count < 100 ? count : "99+"}
                        </Text>
                    </View> :
                    null
                }
            </View>
        );
    }
}

NotificationIcon.propTypes = {
    count: React.PropTypes.number.isRequired
};
