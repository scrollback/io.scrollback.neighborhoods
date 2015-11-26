import React from "react-native";

const {
	TouchableHighlight
} = React;

export default class TouchFeedback extends React.Component {
	render() {
		return (
			<TouchableHighlight {...this.props} underlayColor={this.props.pressColor}>
				{this.props.children}
			</TouchableHighlight>
		);
	}
}

TouchFeedback.propTypes = {
	pressColor: React.PropTypes.string,
	children: React.PropTypes.node
};
