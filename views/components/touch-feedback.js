import React from "react-native";
import VersionCodes from "../../modules/version-codes";

const {
	TouchableNativeFeedback,
	TouchableHighlight,
	Platform
} = React;

export default class TouchFeedback extends React.Component {
	render() {
		if (Platform.OS === "android" && Platform.Version >= VersionCodes.LOLLIPOP) {
			return (
				<TouchableNativeFeedback {...this.props} background={TouchableNativeFeedback.Ripple(this.props.pressColor)}>
					{this.props.children}
				</TouchableNativeFeedback>
			);
		} else {
			return (
				<TouchableHighlight {...this.props} underlayColor={this.props.pressColor}>
					{this.props.children}
				</TouchableHighlight>
			);
		}
	}
}

TouchFeedback.propTypes = {
	pressColor: React.PropTypes.string,
	children: React.PropTypes.node.isRequired
};
