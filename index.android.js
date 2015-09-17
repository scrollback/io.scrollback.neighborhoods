import React from "react-native";
import Home from "./components/home";

const {
    AppRegistry,
    Navigator
} = React;

class HeyNeighbor extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={{ name: "Home", index: 0 }}
                renderScene={(route, navigator) => <Home navigator={navigator} />}
            />
        );
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
