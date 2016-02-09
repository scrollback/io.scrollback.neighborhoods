import React from 'react-native';
import AppbarTouchable from './AppbarTouchable';
import AppbarIcon from './AppbarIcon';

export default class NotificationClearIcon extends React.Component {
	shouldComponentUpdate() {
		return false;
	}

	render() {
		return (
			<AppbarTouchable onPress={this.props.clearAll}>
				<AppbarIcon name='clear-all' />
			</AppbarTouchable>
		);
	}
}

NotificationClearIcon.propTypes = {
	clearAll: React.PropTypes.func.isRequired
};
