import React from "react-native";
import AppController from "./views/controllers/app-controller";

const {
    AppRegistry
} = React;

class HeyNeighbor extends React.Component {
    render() {
        return <AppController />;
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
