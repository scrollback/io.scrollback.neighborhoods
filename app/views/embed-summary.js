import React from "react-native";
import AppText from "./app-text";

const {
	View,
	StyleSheet
} = React;

const styles = StyleSheet.create({
	description: {
		margin: 2
	}
});

export default class EmbedSummary extends React.Component {
	render() {
		return (
			<View>
				{this.props.embed.description ?
					(<AppText
						style={styles.description}
						numberOfLines = {2}
					 >{this.props.embed.description}</AppText>) : null
				}
			</View>
		);
	}
}

EmbedSummary.propTypes = {
	embed: React.PropTypes.object.isRequired
};
