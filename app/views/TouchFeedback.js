import React from 'react-native';
import VersionCodes from '../modules/VersionCodes';

const {
	TouchableNativeFeedback,
	TouchableHighlight,
	Platform
} = React;

export default class TouchFeedback extends React.Component {
	render() {
		if (Platform.OS === 'android' && Platform.Version >= VersionCodes.LOLLIPOP) {
			return (
				<TouchableNativeFeedback {...this.props} background={TouchableNativeFeedback.Ripple(this.props.pressColor, this.props.borderless)}>
					{this.props.children}
				</TouchableNativeFeedback>
			);
		} else {
			return (
				<TouchableHighlight {...this.props} underlayColor={this.props.pressColor || 'rgba(0, 0, 0, .12)'}>
					{this.props.children}
				</TouchableHighlight>
			);
		}
	}
}

TouchFeedback.propTypes = {
	borderless: React.PropTypes.bool,
	pressColor: React.PropTypes.string,
	children: React.PropTypes.node.isRequired
};
