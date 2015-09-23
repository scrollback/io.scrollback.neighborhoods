import React from "react-native";
import Discussions from "./views/discussions";

const {
    AppRegistry,
    Navigator
} = React;

class HeyNeighbor extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={{ name: "Discussions", index: 0 }}
                renderScene={(route, navigator) => <Discussions navigator={navigator} />}
            />
        );
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
