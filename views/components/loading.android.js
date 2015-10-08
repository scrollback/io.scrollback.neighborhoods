import React from "react-native";

const {
	ProgressBarAndroid
} = React;

export default class Loading extends React.Component {
	render() {
		return <ProgressBarAndroid style={this.props.style} />;
	}
}
