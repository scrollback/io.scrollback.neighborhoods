import React from "react-native";
import AppContainer from "./app/containers/app-container";

const {
	AppRegistry
} = React;

export default class HeyNeighbor extends React.Component {
	render() {
		return <AppContainer />;
	}
}

AppRegistry.registerComponent("HeyNeighbor", () => HeyNeighbor);
