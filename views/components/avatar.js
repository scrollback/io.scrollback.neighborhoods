import React from "react-native";

const {
	Image
} = React;

export default class Avatar extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (this.props.uri !== nextProps.uri);
	}

	render() {
		return (
			<Image {...this.props} source={{ uri: this.props.uri }} />
		);
	}
}

Avatar.propTypes = {
	uri: React.PropTypes.string
};
