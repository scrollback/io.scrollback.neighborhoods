import React from "react-native";
import NavigationBarRouteMapper from "./views/utils/navigation-bar-route-mapper";
import routes from "./views/utils/routes";

const {
    AppRegistry,
    StyleSheet,
    Navigator
} = React;

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        marginTop: 56,
        backgroundColor: "#eee"
    }
});

class HeyNeighbor extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={routes.home()}
                renderScene={(route, navigator) => {
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
