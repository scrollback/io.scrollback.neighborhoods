import React from 'react-native';
import AppbarTouchable from '../AppbarTouchable';
import AppbarIcon from '../AppbarIcon';

const {
	NavigationActions
} = React;

export default class AccountButton extends React.Component {
	_handlePress = () => {
		this.props.onNavigation(new NavigationActions.Push({ name: 'account' }));
	};

	render() {
		return (
			<AppbarTouchable onPress={this._handlePress}>
				<AppbarIcon name="menu" />
			</AppbarTouchable>
		);
	}
}

AccountButton.propTypes = {
	onNavigation: React.PropTypes.func.isRequired
};
