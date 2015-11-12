import React from "react-native";
import Colors from "../../colors.json";
import AvatarController from "../controllers/avatar-controller";
import TouchFeedback from "./touch-feedback";

const {
	StyleSheet,
	PixelRatio,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	item: {
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
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
		backgroundColor: Colors.placeholder,
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
	nickText: {
		color: Colors.darkGrey
	},
	status: {
		fontSize: 12,
		marginHorizontal: 16,
		paddingHorizontal: 4,
		color: Colors.fadedBlack
	},
	online: {
		color: Colors.success,
		fontWeight: "bold"
	}
});

export default class PeopleListItem extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.user.id !== nextProps.user.id ||
			this.props.user.status !== nextProps.user.status
		);
	}

	render() {
		const { user } = this.props;

		return (
			<View style={styles.item}>
				<TouchFeedback>
					<View style={styles.person}>
						<View style={styles.avatar}>
							<AvatarController
								size={36}
								nick={user.id}
								style={styles.image}
							/>
						</View>
						<View style={styles.nick}>
							<Text style={styles.nickText}>{user.id}</Text>
						</View>
						<View>
							<Text style={[ styles.status, user.status === "online" ? styles.online : null ]}>
								{user.status ? user.status.toUpperCase() : "OFFLINE"}
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
		id: React.PropTypes.string.isRequired,
		status: React.PropTypes.string.isRequired
	}).isRequired
};
