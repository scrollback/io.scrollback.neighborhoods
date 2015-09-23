import React from "react-native";
import Discussions from "./views/discussions";
import Chat from "./views/chat";
import Avatar from "./views/avatar";

const {
    AppRegistry,
    StyleSheet,
    Navigator,
    Text,
    View,
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

function renderScene(route, navigator) {
    switch (route.id) {
    case "discussions":
        return <Discussions navigator={navigator} style={styles.scene} />;
    case "chat":
        return <Chat navigator={navigator} style={styles.scene} />;
    }
}

const NavigationBarRouteMapper = {
    LeftButton(route, navigator) {
        if (route.id === "home") {
            return (
                <View style={styles.avatar}>
                    <Avatar nick="satya164" size={24} style={styles.image} />
                </View>
            );
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
                initialRoute={{ id: "discussions", title: "Discussions" }}
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
