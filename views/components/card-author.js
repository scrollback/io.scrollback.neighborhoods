import React from "react-native";
import Colors from "../../colors.json";
import AvatarRound from "./avatar-round";

const {
	StyleSheet,
	Text,
	View
} = React;

const styles = StyleSheet.create({
	author: {
		flexDirection: "row",
		alignItems: "center"
	},
	name: {
		flex: 1,
		color: Colors.grey,
		fontSize: 12,
		marginHorizontal: 8
	}
});

export default class CardAuthor extends React.Component {
	shouldComponentUpdate(nextProps) {
		return this.props.nick !== nextProps.nick;
	}

	render() {
		const { nick } = this.props;

		return (
			<View {...this.props} style={[ styles.author, this.props.style ]}>
				<AvatarRound
					size={24}
					nick={nick}
				/>
				<Text style={styles.name}>{nick}</Text>
			</View>
		);
	}
}

CardAuthor.propTypes = {
	nick: React.PropTypes.string.isRequired
};
