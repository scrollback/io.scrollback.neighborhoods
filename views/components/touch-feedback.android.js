import React from "react-native";
import VersionCodes from "../../modules/version-codes";

const {
	TouchableNativeFeedback,
	Platform
} = React;

export default class TouchFeedback extends React.Component {
	render() {
		return (
			<TouchableNativeFeedback
				{...this.props}
				background={
					Platform.Version >= VersionCodes.LOLLIPOP ? TouchableNativeFeedback.Ripple(this.props.pressColor) : TouchableNativeFeedback.SelectableBackground()
				}
			>
				{this.props.children}
			</TouchableNativeFeedback>
		);
	}
}

TouchFeedback.propTypes = {
	pressColor: React.PropTypes.string,
	children: React.PropTypes.node
};
