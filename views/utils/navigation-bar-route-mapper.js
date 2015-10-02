import React from "react-native";
import routes from "./routes";

const {
    StyleSheet,
    Text,
    Image,
    TouchableHighlight
} = React;

const styles = StyleSheet.create({
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        marginVertical: 14,
        marginRight: 64,
        paddingHorizontal: 4
    },
    icon: {
        height: 24,
        width: 24,
        margin: 16
    }
});

const NavigationBarRouteMapper = {
    LeftButton(route, navigator) {
        const goBack = () => {
            if (navigator.getCurrentRoutes().length > 1) {
                navigator.pop();
            } else {
                navigator.replace(routes.home());
            }
        };

        if (route.leftComponent) {
            return <route.leftComponent {...route.passProps} navigator={navigator} />;
        }

        if (route.index !== 0) {
            return (
                <TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" onPress={goBack}>
                    <Image source={require("image!ic_back_white")} style={styles.icon} />
                </TouchableHighlight>
            );
        }
    },

    RightButton(route, navigator) {
        if (route.rightComponent) {
            return <route.rightComponent {...route.passProps} navigator={navigator} />;
        }

        return null;
    },

    Title(route, navigator) {
        if (route.titleComponent) {
            return <route.titleComponent {...route.passProps} navigator={navigator} />;
        }

        return (
            <Text style={styles.title} numberOfLines={1}>
                {route.title}
            </Text>
        );
    }
};

export default NavigationBarRouteMapper;
