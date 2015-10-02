import React from "react-native";
import App from "./views/components/app";

const {
    AppRegistry
} = React;

class HeyNeighbor extends React.Component {
    render() {
        return <App />;
    }
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
