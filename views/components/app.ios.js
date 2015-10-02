import React from "react-native";
import NavigationBarRouteMapper from "../utils/navigation-bar-route-mapper";
import routes from "../utils/routes";

const {
    StyleSheet,
    Navigator
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

export default class App extends React.Component {
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
