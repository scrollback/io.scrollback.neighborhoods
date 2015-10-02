import React from "react-native";
import NavigationBarRouteMapper from "./navigation-bar-route-mapper";

const {
    StyleSheet,
    Navigator
} = React;

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: "#673ab7"
    },
});

export default (
    <Navigator.NavigationBar
        routeMapper={NavigationBarRouteMapper}
        style={styles.navbar}
    />
);
