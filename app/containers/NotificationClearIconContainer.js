/* @flow */

import React from 'react-native';
import NotificationClearIcon from '../views/NotificationClearIcon';
import Container from './Container';

class NotificationClearIconContainer extends React.Component {
	_clearAll = () => {
		this.dispatch('note', { dismissTime: Date.now() });
	};

	render() {
		return <NotificationClearIcon {...this.props} clearAll={this._clearAll} />;
	}
}

export default Container(NotificationClearIconContainer);
