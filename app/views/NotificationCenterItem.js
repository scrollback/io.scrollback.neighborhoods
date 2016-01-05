import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import Icon from "./Icon";
import AvatarRound from "./AvatarRound";
import Time from "./Time";
import TouchFeedback from "./TouchFeedback";
import routes from "../utils/routes";

const {
	StyleSheet,
	View,
	TouchableHighlight,
	PixelRatio
} = React;

const styles = StyleSheet.create({
	item: {
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get()
	},
	note: {
		flexDirection: "row"
	},
	avatarContainer: {
		margin: 16
	},
	content: {
		flex: 1,
		marginVertical: 12
	},
	title: {
		color: Colors.grey
	},
	summary: {
		fontSize: 12,
		lineHeight: 18,
		color: Colors.grey
	},
	strong: {
		color: Colors.darkGrey
	},
	timestampContainer: {
		flexDirection: "row",
		marginTop: 4
	},
	timestamp: {
		fontSize: 11,
		color: Colors.black,
		marginLeft: 4,
		paddingHorizontal: 4,
		opacity: 0.3
	},
	icon: {
		color: Colors.black,
		opacity: 0.3
	},
	metaIcon: {
		marginVertical: 2
	},
	close: {
		margin: 14
	},
	closeButton: {
		borderRadius: 22,
		margin: 2
	},
	badge: {
		position: "absolute",
		alignItems: "center",
		bottom: -1,
		right: -1,
		height: 15,
		width: 15,
		borderRadius: 8,
		borderColor: Colors.white,
		borderWidth: 1
	},
	badgeIcon: {
		marginVertical: 1,
		textAlign: "center",
		color: Colors.white
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
				summary.push(<AppText key={1} style={styles.strong}>{count}</AppText>, " new mentions in");
			} else {
				summary.push(<AppText key={1} style={styles.strong}>{noteData.from}</AppText>, " mentioned you in");
			}

			if (noteData.title) {
				summary.push(" ", <AppText key={2} style={styles.strong}>{noteData.title}</AppText>);
			}

			summary.push(" - ", <AppText key={3} style={styles.strong}>{room}</AppText>);

			break;
		case "reply":
			if (count > 1) {
				summary.push(<AppText key={1} style={styles.strong}>{count}</AppText>, " new replies");
			} else {
				summary.push(<AppText key={1} style={styles.strong}>{noteData.from}</AppText>, " replied");
			}

			if (noteData.title) {
				summary.push(" to ", <AppText key={2} style={styles.strong}>{noteData.title}</AppText>);
			}

			summary.push(" in ", <AppText key={3} style={styles.strong}>{room}</AppText>);

			break;
		case "thread":
			if (count > 1) {
				summary.push(<AppText key={1} style={styles.strong}>{count}</AppText>, " new discussions");
			} else {
				summary.push(<AppText key={1} style={styles.strong}>{noteData.from}</AppText>, " started a discussion");

				if (noteData.title) {
					summary.push(" on ", <AppText key={2} style={styles.strong}>{noteData.title}</AppText>);
				}
			}

			summary.push(" in ", <AppText key={3} style={styles.strong}>{room}</AppText>);

			break;
		default:
			if (count > 1) {
				summary.push(<AppText key={1} style={styles.strong}>{count}</AppText>, " new notifications");
			} else {
				summary.push("New notification from ", <AppText key={1} style={styles.strong}>{noteData.from}</AppText>);
			}

			summary.push(" in ", <AppText key={2} style={styles.strong}>{room}</AppText>);
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
			navigator.push(routes.chat({
				thread,
				room
			}));

			break;
		case "thread":
			if (note.count > 1) {
				navigator.push(routes.room({ room }));
			} else {
				navigator.push(routes.chat({
					thread: note.ref,
					room
				}));
			}

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
							<AvatarRound
								nick={note.noteData.from}
								size={36}
							/>
							<View style={[ styles.badge, { backgroundColor: this._getIconColor() } ]}>
								<Icon
									name={this._getIconName()}
									style={styles.badgeIcon}
									size={10}
								/>
							</View>
						</View>
						<View style={styles.content}>
							<View>
								<AppText numberOfLines={5} style={styles.title} >{this._getSummary(note)}</AppText>
							</View>
							<View>
								<AppText numberOfLines={1} style={styles.summary} >{note.noteData.text}</AppText>
							</View>
							<View style={styles.timestampContainer}>
								<Icon
									name="access-time"
									style={[ styles.icon, styles.metaIcon ]}
									size={12}
								/>
								<Time
									type="long"
									time={note.time}
									style={styles.timestamp}
								/>
							</View>
						</View>
							<TouchableHighlight
								style={styles.closeButton}
								underlayColor={Colors.underlay}
								onPress={this._onDismiss.bind(this)}
							>
								<View style={styles.close}>
									<Icon
										name="close"
										style={styles.icon}
										size={16}
									/>
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
