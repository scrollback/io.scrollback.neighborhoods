import React from "react-native";

const { TouchableNativeFeedback } = React;

export default class TouchFeedback extends React.Component {
	render() {
		return (
			<TouchableNativeFeedback {...this.props}>
				{this.props.children}
			</TouchableNativeFeedback>
		);
	}
}

TouchFeedback.propTypes = {
	children: React.PropTypes.node
};
