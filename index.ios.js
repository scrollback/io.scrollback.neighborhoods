import React from 'react-native';
import UpgradeBanner from './app/views/UpgradeBanner';

const {
	AppRegistry
} = React;

export default class HeyNeighbor extends React.Component {
	render() {
		return <UpgradeBanner />;
	}
}

AppRegistry.registerComponent('HeyNeighbor', () => HeyNeighbor);
