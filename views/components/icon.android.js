import React from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default class Icon extends React.Component {
	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		return <MaterialIcons {...this.props} ref={c => this._root = c} />;
	}
}
