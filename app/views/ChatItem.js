import React from "react-native";
import Colors from "../../Colors.json";
import AvatarRound from "./AvatarRound";
import ChatBubble from "./ChatBubble";
import Embed from "./Embed";
import Modal from "./Modal";
import Icon from "./Icon";
import Time from "./Time";
import Link from "./Link";
import Linking from "../modules/Linking";

const {
	Clipboard,
	ToastAndroid,
	StyleSheet,
	TouchableOpacity,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 8,
		marginVertical: 4
	},
	chat: {
		flex: 0,
		flexDirection: "column",
		alignItems: "flex-end"
	},
	received: {
		alignItems: "flex-start",
		marginLeft: 44
	},
	timestamp: {
		flexDirection: "row",
		marginTop: 4
	},
	timestampLeft: {
		marginLeft: 52
	},
	timestampRight: {
		alignSelf: "flex-end"
	},
	timestampIcon: {
		color: Colors.black,
		marginVertical: 2,
		opacity: 0.3
	},
	timestampText: {
		color: Colors.black,
		fontSize: 12,
		lineHeight: 18,
		marginHorizontal: 6,
		paddingHorizontal: 8,
		opacity: 0.3
	},
	avatar: {
		position: "absolute",
		top: 0,
		left: -36,
		alignSelf: "flex-end"
	},
	thumbnail: {
		marginVertical: 4
	},
	bubbleReceived: {
		marginRight: 8
	},
	bubbleSent: {
		marginLeft: 8
	},
	hidden: {
		opacity: 0.3
	}
});

export default class ChatItem extends React.Component {
	shouldComponentUpdate(nextProps) {
		if (this.props.text && nextProps.text && this.props.previousText && nextProps.previousText) {
			return (
					this.props.hidden !== nextProps.hidden ||
					this.props.text.text !== nextProps.text.text ||
					this.props.text.from !== nextProps.text.from ||
					this.props.text.time !== nextProps.text.time ||
					this.props.previousText.from !== nextProps.previousText.from ||
					this.props.previousText.time !== nextProps.previousText.time
				);
		} else {
			return true;
		}
	}

	_copyToClipboard = text => {
		Clipboard.setString(text);
		ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
	};

	_showMenu = () => {
		const { text, metadata, currentUser } = this.props;

		const menu = {};

		if (metadata && metadata.type === "photo") {
			menu["Open image in browser"] = () => Linking.openURL(metadata.url.toLowerCase());
			menu["Copy image link"] = () => this._copyToClipboard(metadata.url);
		} else {
			menu["Copy text"] = () => this._copyToClipboard(text.text);
			menu["Quote message"] = () => this.props.quoteMessage(text);
		}

		if (currentUser !== text.from) {
			menu["Reply to @" + text.from] = () => this.props.replyToMessage(text);
		}

		if (this.props.isCurrentUserAdmin()) {
			if (this.props.hidden) {
				menu["Unhide message"] = () => this.props.unhideText();
			} else {
				menu["Hide message"] = () => this.props.hideText();
			}

			if (text.from !== this.props.currentUser) {
				if (this.props.isUserBanned()) {
					menu["Unban " + text.from] = () => this.props.unbanUser();
				} else {
					menu["Ban " + text.from] = () => this.props.banUser();
				}
			}
		}

		Modal.showActionSheetWithItems(menu);
	};

	render() {
		const { text, hidden, metadata, previousText, currentUser } = this.props;

		const received = text.from !== currentUser;
		const links = Link.parseLinks(text.text, 1);

		let cover;

		if (metadata && metadata.type === "photo") {
			cover = (
				<Embed
					url={metadata.url}
					data={metadata}
					showTitle={false}
					thumbnailStyle={styles.thumbnail}
				/>
			);
		} else if (links.length) {
			cover = <Embed url={links[0]} thumbnailStyle={styles.thumbnail} />;
		}

		let showAuthor = received,
			showTime = false;

		if (previousText) {
			if (received) {
				showAuthor = text.from !== previousText.from;
			}

			showTime = (text.time - previousText.time) > 300000;
		}

		return (
			<View {...this.props} style={[ styles.container, this.props.style ]}>
				<View style={[ styles.chat, received ? styles.received : null, hidden ? styles.hidden : null ]}>
					{received && showAuthor ?
						<AvatarRound
							style={styles.avatar}
							size={36}
							nick={text.from}
						/> :
						null
					}

					<TouchableOpacity activeOpacity={0.5} onPress={this._showMenu}>
						<ChatBubble
							text={metadata && metadata.type === "photo" ? { from: text.from } : text}
							type={received ? "left" : "right"}
							showAuthor={showAuthor}
							showArrow={received ? showAuthor : true}
							style={received ? styles.bubbleReceived : styles.bubbleSent}
						>
							{cover}
						</ChatBubble>
					</TouchableOpacity>
				</View>

				{showTime ?
					(<View style={[ styles.timestamp, received ? styles.timestampLeft : styles.timestampRight ]}>
					 <Icon
						name="access-time"
						style={styles.timestampIcon}
						size={12}
					 />
					 <Time
						type="long"
						time={text.time}
						style={styles.timestampText}
					 />
					</View>) :
					null
				}
			</View>
		);
	}
}

ChatItem.propTypes = {
	text: React.PropTypes.shape({
		text: React.PropTypes.string.isRequired,
		from: React.PropTypes.string.isRequired,
		time: React.PropTypes.number.isRequired
	}).isRequired,
	metadata: React.PropTypes.object,
	previousText: React.PropTypes.shape({
		from: React.PropTypes.string.isRequired,
		time: React.PropTypes.number.isRequired
	}),
	currentUser: React.PropTypes.string.isRequired,
	quoteMessage: React.PropTypes.func.isRequired,
	replyToMessage: React.PropTypes.func.isRequired,
	hidden: React.PropTypes.bool.isRequired,
	isCurrentUserAdmin: React.PropTypes.func.isRequired,
	isUserBanned: React.PropTypes.func.isRequired,
	hideText: React.PropTypes.func.isRequired,
	unhideText: React.PropTypes.func.isRequired,
	banUser: React.PropTypes.func.isRequired,
	unbanUser: React.PropTypes.func.isRequired
};
