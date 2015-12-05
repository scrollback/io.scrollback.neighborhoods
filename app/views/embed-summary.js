import React from "react-native";
import AppText from "./app-text";

export default class EmbedSummary extends React.Component {
	render() {
		if (this.props.embed.description) {
			return <AppText numberOfLines={2} {...this.props}>{this.props.embed.description}</AppText>;
		} else {
			return null;
		}
	}
}

EmbedSummary.propTypes = {
	embed: React.PropTypes.object.isRequired
};
