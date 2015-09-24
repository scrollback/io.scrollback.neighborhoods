import React from "react-native";
import FilteredLocalities from "./views/filtered-localities";
import Avatar from "./views/avatar";

const {
    AppRegistry,
    StyleSheet,
    Navigator,
    Text,
    View,
    Image,
    TouchableOpacity,
    BackAndroid
} = React;

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: "#673ab7"
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        marginVertical: 14,
        paddingHorizontal: 4
    },
    icon: {
        height: 24,
        width: 24,
        margin: 16
    },
    scene: {
        flex: 1,
        marginTop: 56,
        backgroundColor: "#eee"
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
                    <Avatar nick="satya164" size={24} style={styles.image} />
                </View>
            );
        }

        return (
            <TouchableOpacity onPress={() => navigator.pop()}>
                <Image source={require("image!ic_back_white")} style={styles.icon} />
            </TouchableOpacity>
        );
    },

    RightButton(route, navigator) {
        if (route.rightButtonIcon) {
            return (
                <TouchableOpacity onPress={() => route.onRightButtonPress(route, navigator)}>
                    <Image source={route.rightButtonIcon} style={styles.icon} />
                </TouchableOpacity>
            );
        }

        return null;
    },

    Title(route) {
        if (route.titleComponent) {
            return <route.titleComponent {...route.titleComponentProps} />;
        }

        return (
            <Text style={styles.title}>
                {route.title}
            </Text>
        );
    }
};

let _navigator;

BackAndroid.addEventListener("hardwareBackPress", () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop();

        return true;
    }

    return false;
});

class HeyNeighbor extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={{
                    title: "Hey, Neighbor",
                    component: FilteredLocalities,
                    index: 0
                }}
                renderScene={(route, navigator) => {
                    _navigator = navigator;

                    return (
                        <route.component
                            {...route.passProps}
                            navigator={navigator}
                            style={styles.scene}
                            />
                    );
                }}
                navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={NavigationBarRouteMapper}
                        style={styles.navbar}
                    />
                }
            />
        );
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
