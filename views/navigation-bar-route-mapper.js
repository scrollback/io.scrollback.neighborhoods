import React from "react-native";
import NotificationIconController from "./notification-icon-controller";
import Avatar from "./avatar";

const {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight
} = React;

const styles = StyleSheet.create({
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        marginVertical: 16,
        marginRight: 64,
        paddingHorizontal: 4
    },
    icon: {
        height: 24,
        width: 24,
        margin: 16
    },
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

const NavigationBarRouteMapper = {
    LeftButton(route, navigator) {
        if (route.index === 0 || navigator.getCurrentRoutes().length === 1) {
            return (
                <View style={styles.avatar}>
                    <Avatar
                        size={24}
                        nick="satya164"
                        style={styles.image}
                    />
                </View>
            );
        }

        return (
            <TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" onPress={() => navigator.pop()}>
                <Image source={require("image!ic_back_white")} style={styles.icon} />
            </TouchableHighlight>
        );
    },

    RightButton(route, navigator) {
        let rightComponent;

        if (route.rightButtonIcon) {
            rightComponent = (
                <TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" onPress={() => route.onRightButtonPress(route, navigator)}>
                    <Image source={route.rightButtonIcon} style={styles.icon} />
                </TouchableHighlight>
            );
        }

        if (route.rightComponent) {
            rightComponent = <route.rightComponent {...route.passProps} />;
        }

        return (
            <View>
                <NotificationIconController navigator={navigator} />
                {rightComponent}
            </View>
        );
    },

    Title(route) {
        if (route.titleComponent) {
            return <route.titleComponent {...route.passProps} />;
        }

        return (
            <Text style={styles.title} numberOfLines={1}>
                {route.title}
            </Text>
        );
    }
};

export default NavigationBarRouteMapper;
