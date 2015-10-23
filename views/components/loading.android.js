import React from "react-native";

const {
	ProgressBarAndroid
} = React;

export default class Loading extends React.Component {
	shouldComponentUpdate() {
		return false;
	}

	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		return <ProgressBarAndroid ref={c => this._root = c} style={this.props.style} />;
	}
}
