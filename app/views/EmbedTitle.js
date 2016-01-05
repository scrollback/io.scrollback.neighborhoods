import React from "react-native";
import AppText from "./AppText";
import Colors from "../../Colors.json";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	title: {
		fontWeight: "bold",
		color: Colors.black
	}
});

export default class EmbedTitle extends React.Component {
	render() {
		if (this.props.embed.title) {
			return (
				<AppText
					numberOfLines={1}
					{...this.props}
					style={[ styles.title, this.props.style ]}
				>
					{this.props.embed.title}
				</AppText>
			);
		} else {
			return null;
		}
	}
}

EmbedTitle.propTypes = {
	embed: React.PropTypes.shape({
		title: React.PropTypes.string
	}).isRequired
};
