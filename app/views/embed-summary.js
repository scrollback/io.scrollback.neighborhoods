import React from "react-native";
import AppText from "./app-text";

const {
	View
} = React;

export default class EmbedSummary extends React.Component {
	render() {
		return (
			<View>
				{this.props.embed.description ?
					(<AppText numberOfLines = {2}>{this.props.embed.description}</AppText>) : null
				}
			</View>
		);
	}
}

EmbedSummary.propTypes = {
	embed: React.PropTypes.shape({
		description: React.PropTypes.string.isRequired
	}).isRequired
};
