import React from 'react-native';

const {
	Image
} = React;

export default class Avatar extends React.Component {
	render() {
		if (this.props.uri) {
			return <Image {...this.props} source={{ uri: this.props.uri }} />;
		} else {
			return null;
		}
	}
}

Avatar.propTypes = {
	uri: React.PropTypes.string
};
