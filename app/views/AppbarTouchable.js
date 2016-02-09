import React from 'react-native';
import TouchFeedback from './TouchFeedback';

const {
	View
} = React;

export default class AppbarTouchable extends React.Component {
	_onPress = () => {
		global.requestAnimationFrame(() => this.props.onPress());
	};

	render() {
		return (
			<TouchFeedback
				{...this.props}
				borderless
				pressColor={this.props.type === 'secondary' ? 'rgba(0, 0, 0, .15)' : 'rgba(255, 255, 255, .15)'}
				onPress={this._onPress}
				delayPressIn={0}
			>
				<View>
					{this.props.children}
				</View>
			</TouchFeedback>
		);
	}
}

AppbarTouchable.propTypes = {
	type: React.PropTypes.oneOf([ 'primary', 'secondary' ]),
	onPress: React.PropTypes.func.isRequired,
	children: React.PropTypes.node.isRequired
};
