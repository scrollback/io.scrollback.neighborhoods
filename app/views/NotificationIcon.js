import React from 'react-native';
import Colors from '../../Colors.json';
import AppbarTouchable from './AppbarTouchable';
import AppbarIcon from './AppbarIcon';
import NotificationBadgeContainer from '../containers/NotificationBadgeContainer';

const {
	StyleSheet,
	NavigationActions,
	View
} = React;

const styles = StyleSheet.create({
	badge: {
		position: 'absolute',
		top: 10,
		right: 10,
		backgroundColor: Colors.badge,
		elevation: 2
	}
});

export default class NotificationIcon extends React.Component {
	_onPress = () => {
		this.props.onNavigation(new NavigationActions.Push({ name: 'notes' }));
	};

	render() {
		return (
			<AppbarTouchable onPress={this._onPress}>
				<View>
					<AppbarIcon name='notifications' />
					<NotificationBadgeContainer style={styles.badge} grouped />
				</View>
			</AppbarTouchable>
		);
	}
}

NotificationIcon.propTypes = {
	onNavigation: React.PropTypes.func.isRequired
};
