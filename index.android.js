import React from "react-native";
import Home from "./views/home";
import Chat from "./views/chat";

const {
    AppRegistry,
    Navigator
} = React;

function renderScene(route, navigator) {
    switch (route.id) {
    case "home":
        return <Home navigator={navigator} />;
    case "chat":
        return <Chat navigator={navigator} />;
    }
}

class HeyNeighbor extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={{ id: "home", name: "Home" }}
                renderScene={renderScene.bind(this)}
            />
        );
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
