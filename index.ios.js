import React from "react-native";
import Discussions from "./views/discussions";

const {
    AppRegistry,
    NavigatorIOS
} = React;

class HeyNeighbor extends React.Component {
    render() {
        return (
            <NavigatorIOS
                initialRoute={{
                    title: "Discussions",
                    component: Discussions,
                    index: 0
                }}
            />
        );
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
