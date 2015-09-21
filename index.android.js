import React from "react-native";
import Home from "./views/home";
import Chat from "./views/chat";

const {
    AppRegistry,
    StyleSheet,
    Navigator,
    Text,
    Image,
    TouchableOpacity
} = React;

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: "#673ab7"
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
        marginVertical: 13,
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
    }
});

function renderScene(route, navigator) {
    switch (route.id) {
    case "home":
        return <Home navigator={navigator} style={styles.scene} />;
    case "chat":
        return <Chat navigator={navigator} style={styles.scene} />;
    }
}

const NavigationBarRouteMapper = {
    LeftButton(route, navigator) {
        if (route.id === "home") {
            return null;
        }

        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}>
                <Image source={require("image!ic_back_white")} style={styles.icon} />
            </TouchableOpacity>
        );
    },

    RightButton() {
        return null;
    },

    Title(route) {
        return (
            <Text style={styles.title}>
                {route.title}
            </Text>
        );
    }
};

class HeyNeighbor extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={{ id: "home", title: "Home" }}
                renderScene={renderScene.bind(this)}
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
