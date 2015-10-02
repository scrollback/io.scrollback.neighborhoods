import React from "react-native";
import AppController from "./views/controllers/app-controller";
import renderScene from "./views/utils/render-scene";

const {
    AppRegistry,
    Navigator
} = React;

class HeyNeighbor extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={{ component: AppController }}
                renderScene={renderScene}
            />
        );
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
