import React from 'react-native';
import Splash from './Splash';
import Onboard from './Onboard/Onboard';
import Offline from './Offline';

export default class App extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.user !== nextProps.user ||
			this.props.connectionStatus !== nextProps.connectionStatus
		);
	}

	render() {
		const { user, connectionStatus } = this.props;

		if (user === 'missing') {
			if (connectionStatus === 'offline') {
				return <Offline />;
			} else {
				return <Splash />;
			}
		}

		return <Onboard />;
	}
}

App.propTypes = {
	user: React.PropTypes.string.isRequired,
	connectionStatus: React.PropTypes.oneOf([ 'connecting', 'online', 'offline' ]).isRequired
};
