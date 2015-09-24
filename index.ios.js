import React from "react-native";
import Home from "./views/Home";

const {
    AppRegistry,
    NavigatorIOS
} = React;

class HeyNeighbor extends React.Component {
    render() {
        return (
            <NavigatorIOS
                initialRoute={{
                    title: "Hey, Neighbor",
                    component: Home,
                    index: 0
                }}
            />
        );
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
