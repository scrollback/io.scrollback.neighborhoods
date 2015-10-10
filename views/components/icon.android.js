import React from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default class Icon extends React.Component {
	render() {
		return <MaterialIcons {...this.props} />;
	}
}
