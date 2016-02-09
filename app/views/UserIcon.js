import React from 'react-native';
import AvatarRound from './AvatarRound';

export default class UserIcon extends React.Component {
	render() {
		return <AvatarRound {...this.props} />;
	}
}
