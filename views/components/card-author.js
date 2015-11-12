import React from "react-native";
import Colors from "../../colors.json";
import AvatarController from "../controllers/avatar-controller";

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
	},
	avatar: {
		height: 24,
		width: 24,
		borderRadius: 12,
		backgroundColor: Colors.placeholder
	},
	image: {
		flex: 1,
		borderRadius: 12
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
				<View style={styles.avatar}>
					<AvatarController
						size={16}
						nick={nick}
						style={styles.image}
					/>
				</View>
				<Text style={styles.name}>{nick}</Text>
			</View>
		);
	}
}

CardAuthor.propTypes = {
	nick: React.PropTypes.string.isRequired
};
