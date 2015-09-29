import React from "react-native";
import NavigationBarRouteMapper from "./views/navigation-bar-route-mapper";
import Home from "./views/home";

const {
    AppRegistry,
    StyleSheet,
    Navigator,
    BackAndroid
} = React;

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: "#673ab7"
    },
    scene: {
        flex: 1,
        marginTop: 56,
        backgroundColor: "#eee"
    }
});

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
                    title: "Hey, Neighbor!",
                    component: Home,
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
