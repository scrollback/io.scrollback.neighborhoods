import React from "react-native";
import Avatar from "./avatar";
import TouchFeedback from "./touch-feedback";

const {
	StyleSheet,
	PixelRatio,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	item: {
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .08)",
		borderBottomWidth: 1 / PixelRatio.get()
	},
	person: {
		flexDirection: "row",
		alignItems: "center"
	},
	avatar: {
		height: 36,
		width: 36,
		borderRadius: 18,
		backgroundColor: "#999",
		marginHorizontal: 16,
		marginVertical: 12
	},
	image: {
		flex: 1,
		resizeMode: "cover",
		borderRadius: 18
	},
	nick: {
		flex: 1
	},
	status: {
		fontSize: 12,
		marginHorizontal: 16,
		paddingHorizontal: 4,
		color: "#aaa"
	},
	online: {
		color: "#4CAF50",
		fontWeight: "bold"
	}
});

export default class PeopleListItem extends React.Component {
	render() {
		const { user } = this.props;

		return (
			<View style={styles.item}>
				<TouchFeedback>
					<View style={styles.person}>
						<View style={styles.avatar}>
							<Avatar
								size={36}
								nick={user.id}
								style={styles.image}
							/>
						</View>
						<View style={styles.nick}>
							<Text>{user.id}</Text>
						</View>
						<View>
							<Text style={[ styles.status, user.status === "online" ? styles.online : null ]}>
								{user.status.toUpperCase()}
							</Text>
						</View>
					</View>
				</TouchFeedback>
			</View>
		);
	}
}

PeopleListItem.propTypes = {
	user: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired
	}).isRequired
};
