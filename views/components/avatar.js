import React from "react-native";

const {
	Image
} = React;

export default class CardAuthor extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (this.props.nick !== nextProps.nick || this.props.size !== nextProps.size);
	}

	render() {
		return (
			<Image {...this.props} source={{ uri: "http://scrollback.io/i/" + this.props.nick + "/picture?size=" + (this.props.size || 48) }} />
		);
	}
}

CardAuthor.propTypes = {
	nick: React.PropTypes.string.isRequired,
	size: React.PropTypes.number
};
