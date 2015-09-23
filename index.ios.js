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
                renderScene={(route, navigator) => <Discussions navigator={navigator} />}
            />
        );
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
