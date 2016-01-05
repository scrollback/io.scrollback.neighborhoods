import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	title: {
		fontWeight: "bold",
		color: Colors.darkGrey
	}
});

export default class CardTitle extends React.Component {
	shouldComponentUpdate(nextProps) {
		return this.props.text !== nextProps.text;
	}

	render() {
		return (
			<AppText
				{...this.props}
				style={[ styles.title, this.props.style ]}
				numberOfLines={2}
			>
				{this.props.text}
			</AppText>
		);
	}
}

CardTitle.propTypes = {
	text: React.PropTypes.string.isRequired
};
