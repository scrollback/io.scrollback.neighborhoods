import React from "react-native";

const {
	TouchableNativeFeedback
} = React;

export default class TouchFeedback extends React.Component {
	render() {
		return (
			<TouchableNativeFeedback {...this.props} background={TouchableNativeFeedback.Ripple(this.props.pressColor)}>
				{this.props.children}
			</TouchableNativeFeedback>
		);
	}
}

TouchFeedback.propTypes = {
	pressColor: React.PropTypes.string,
	children: React.PropTypes.node
};
