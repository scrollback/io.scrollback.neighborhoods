import React from "react-native";
import Icon from "./icon";
import AvatarController from "../controllers/avatar-controller";
import TouchFeedback from "./touch-feedback";
import routes from "../utils/routes";
import timeUtils from "../../lib/time-utils";

const {
	StyleSheet,
	View,
	Text,
	TouchableHighlight,
	PixelRatio
} = React;

const styles = StyleSheet.create({
	item: {
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .08)",
		borderBottomWidth: 1 / PixelRatio.get()
	},
	note: {
		flexDirection: "row"
	},
	avatarContainer: {
		marginHorizontal: 16,
		marginVertical: 12
	},
	avatar: {
		height: 36,
		width: 36,
		borderRadius: 18,
		backgroundColor: "rgba(0, 0, 0, .16)"
	},
	image: {
		flex: 1,
		resizeMode: "cover",
		borderRadius: 18
	},
	content: {
		flex: 1,
		marginVertical: 8
	},
	title: {
		lineHeight: 21,
		color: "#999"
	},
	summary: {
		lineHeight: 18,
		fontSize: 12,
		color: "#999"
	},
	strong: {
		color: "#555"
	},
	timestampContainer: {
		flexDirection: "row"
	},
	timestamp: {
		fontSize: 11,
		marginVertical: 2,
		color: "#aaa",
		marginLeft: 4,
		paddingHorizontal: 4
	},
	icon: {
		fontSize: 12,
		color: "#000",
		marginVertical: 4,
		opacity: 0.3
	},
	close: {
		paddingVertical: 12,
		paddingHorizontal: 16
	},
	badge: {
		position: "absolute",
		alignItems: "center",
		bottom: -2,
		right: -2,
		height: 17,
		width: 17,
		borderRadius: 9,
		borderColor: "#fff",
		borderWidth: 2
	},
	badgeIcon: {
		marginVertical: 1,
		textAlign: "center",
		fontSize: 10,
		color: "#fff"
	}
});

export default class NotificationCenterItem extends React.Component {
	_extractPart(note, index) {
		return typeof note.group === "string" ? note.group.split("/")[index] : null;
	}

	_getThread(note) {
		const thread = this._extractPart(note, 1);

		return (thread === "all" || !thread) ? null : thread;
	}

	_getRoom(note) {
		return this._extractPart(note, 0);
	}

	_getSummary(note) {
		const { noteData, noteType, count } = note;

		const room = this._getRoom(this.props.note);

		const summary = [];

		switch (noteType) {
		case "mention":
			if (count > 1) {
				summary.push(<Text key={1} style={styles.strong}>{count}</Text>, " new mentions in");
			} else {
				summary.push(<Text key={1} style={styles.strong}>{noteData.from}</Text>, " mentioned you in");
			}

			if (noteData.title) {
				summary.push(" ", <Text key={2} style={styles.strong}>{noteData.title}</Text>);
			}

			summary.push(" - ", <Text key={3} style={styles.strong}>{room}</Text>);

			break;
		case "reply":
			if (count > 1) {
				summary.push(<Text key={1} style={styles.strong}>{count}</Text>, " new replies");
			} else {
				summary.push(<Text key={1} style={styles.strong}>{noteData.from}</Text>, " replied");
			}

			if (noteData.title) {
				summary.push(" to ", <Text key={2} style={styles.strong}>{noteData.title}</Text>);
			}

			summary.push(" in ", <Text key={3} style={styles.strong}>{room}</Text>);

			break;
		case "thread":
			if (count > 1) {
				summary.push(<Text key={1} style={styles.strong}>{count}</Text>, " new discussions");
			} else {
				summary.push(<Text key={1} style={styles.strong}>{noteData.from}</Text>, " started a discussion");

				if (noteData.title) {
					summary.push(" on ", <Text key={2} style={styles.strong}>{noteData.title}</Text>);
				}
			}

			summary.push(" in ", <Text key={3} style={styles.strong}>{room}</Text>);

			break;
		default:
			if (count > 1) {
				summary.push(<Text key={1} style={styles.strong}>{count}</Text>, " new notifications");
			} else {
				summary.push("New notification from ", <Text key={1} style={styles.strong}>{noteData.from}</Text>);
			}

			summary.push(" in ", <Text key={2} style={styles.strong}>{room}</Text>);
		}

		return summary;
	}

	_getIconColor() {
		const { note } = this.props;

		switch (note.noteType) {
		case "mention":
			return "#ff5722";
		case "reply":
			return "#2196F3";
		case "thread":
			return "#009688";
		default:
			return "#673ab7";
		}
	}

	_getIconName() {
		const { note } = this.props;

		switch (note.noteType) {
		case "mention":
			return "person";
		case "reply":
			return "reply";
		case "thread":
			return "create";
		default:
			return "notifications";
		}
	}

	_onPress() {
		const { note, navigator } = this.props;

		const room = this._getRoom(note);
		const thread = this._getThread(note);

		switch (note.noteType) {
		case "mention":
		case "reply":
		case "thread":
			navigator.push(routes.chat({
				thread,
				room
			}));

			break;
		default:
			navigator.push(routes.room({ room }));
		}
	}

	_onDismiss() {
		this.props.dismissNote(this.props.note);
	}

	render() {
		const { note } = this.props;

		return (
			<View style={styles.item}>
				<TouchFeedback onPress={this._onPress.bind(this)}>
					<View style={styles.note}>
						<View style={styles.avatarContainer}>
							<View style={styles.avatar}>
								<AvatarController
									size={36}
									nick={note.noteData.from}
									style={styles.image}
								/>
							</View>
							<View style={[ styles.badge, { backgroundColor: this._getIconColor() } ]}>
								<Icon name={this._getIconName()} style={styles.badgeIcon} />
							</View>
						</View>
						<View style={styles.content}>
							<View>
								<Text numberOfLines={5} style={styles.title} >{this._getSummary(note)}</Text>
							</View>
							<View>
								<Text numberOfLines={1} style={styles.summary} >{note.noteData.text}</Text>
							</View>
							<View style={styles.timestampContainer}>
								<Icon name="access-time" style={styles.icon} />
								<Text style={styles.timestamp}>{timeUtils.long(note.time)}</Text>
							</View>
						</View>
						<TouchableHighlight underlayColor="rgba(0, 0, 0, .08)" onPress={this._onDismiss.bind(this)}>
							<View style={styles.close}>
								<Icon name="close" style={styles.icon} />
							</View>
						</TouchableHighlight>
					</View>
				</TouchFeedback>
			</View>
		);
	}
}

NotificationCenterItem.propTypes = {
	note: React.PropTypes.shape({
		count: React.PropTypes.number,
		group: React.PropTypes.string.isRequired,
		noteType: React.PropTypes.string.isRequired,
		noteData: React.PropTypes.shape({
			title: React.PropTypes.string,
			text: React.PropTypes.string.isRequired,
			from: React.PropTypes.string.isRequired
		}).isRequired
	}).isRequired,
	dismissNote: React.PropTypes.func.isRequired,
	navigator: React.PropTypes.object.isRequired
};
