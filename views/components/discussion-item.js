import React from "react-native";
import Colors from "../../colors.json";
import NotificationBadgeController from "../controllers/notification-badge-controller";
import Card from "./card";
import CardTitle from "./card-title";
import CardSummary from "./card-summary";
import DiscussionFooter from "./discussion-footer";
import Embed from "./embed";
import TouchFeedback from "./touch-feedback";
import Modal from "./modal";
import Icon from "./icon";
import Linking from "../../modules/linking";
import Clipboard from "../../modules/clipboard";
import Share from "../../modules/share";
import routes from "../utils/routes";
import textUtils from "../../lib/text-utils";
import oembed from "../../lib/oembed";
import config from "../../store/config";

const {
	ToastAndroid,
	StyleSheet,
	TouchableOpacity,
	Image,
	View
} = React;

const styles = StyleSheet.create({
	image: {
		resizeMode: "cover",
		height: 160
	},
	cover: {
		marginVertical: 4,
		height: 180
	},
	item: {
		marginHorizontal: 16
	},
	footer: {
		marginVertical: 12
	},
	topArea: {
		flexDirection: "row"
	},
	title: {
		flex: 1,
		marginTop: 16
	},
	badge: {
		margin: 12
	},
	expand: {
		marginHorizontal: 16,
		marginVertical: 12,
		color: Colors.fadedBlack
	}
});

export default class DiscussionItem extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
				this.props.thread.title !== nextProps.thread.title ||
				this.props.thread.text !== nextProps.thread.text ||
				this.props.thread.from !== nextProps.thread.from
			);
	}

	_copyToClipboard(text) {
		Clipboard.setText(text);
		ToastAndroid.show("Copied to clipboard", ToastAndroid.SHORT);
	}

	_showMenu() {
		const { thread } = this.props;
		const menu = {};

		menu["Copy title"] = () => this._copyToClipboard(thread.title);

		const textMetadata = textUtils.getMetadata(thread.text);

		if (textMetadata && textMetadata.type === "image") {
			menu["Open image in browser"] = () => Linking.openURL(textMetadata.originalUrl);
			menu["Copy image link"] = () => this._copyToClipboard(textMetadata.originalUrl);
		} else {
			menu["Copy summary"] = () => this._copyToClipboard(thread.text);
		}

		menu["Share discussion"] = () => {
			const { protocol, host } = config.server;
			const { id, to, title } = thread;

			Share.shareItem("Share discussion", `${protocol}//${host}/${to}/${id}/${title.toLowerCase().trim().replace(/['"]/g, "").replace(/\W+/g, "-")}`);
		};

		if (this.props.isCurrentUserAdmin()) {
			if (this.props.isThreadHidden()) {
				menu["Unhide discussion"] = () => this.props.unhideThread();
			} else {
				menu["Hide discussion"] = () => this.props.hideThread();
			}

			if (this.props.isUserBanned()) {
				menu["Unban " + thread.from] = () => this.props.unbanUser();
			} else {
				menu["Ban " + thread.from] = () => this.props.banUser();
			}
		}

		Modal.showActionSheetWithItems(menu);
	}

	_onPress() {
		this.props.navigator.push(routes.chat({
			thread: this.props.thread.id,
			room: this.props.thread.to
		}));
	}

	render() {
		const { thread } = this.props;

		const trimmedText = thread.text.trim();

		const links = textUtils.getLinks(trimmedText);
		const textMetadata = textUtils.getMetadata(trimmedText);

		let cover;

		if (textMetadata && textMetadata.type === "image") {
			cover = (
				<Image
					style={styles.cover}
					source={{ uri: textMetadata.thumbnailUrl }}
				/>
			);
		} else if (links.length) {
			const uri = links[0];
			const endpoint = oembed(uri);

			if (endpoint) {
				cover = (
					<Embed
						style={styles.cover}
						uri={uri}
						endpoint={endpoint}
					/>
				);
			}
		}

		return (
			<Card {...this.props}>
				<TouchFeedback onPress={this._onPress.bind(this)}>
					<View>
						<View style={styles.topArea}>
							<CardTitle
								style={[ styles.item, styles.title ]}
								text={this.props.thread.title}
							/>

							<NotificationBadgeController thread={this.props.thread.id} style={styles.badge} />

							<TouchableOpacity onPress={this._showMenu.bind(this)}>
								<Icon
									name="expand-more"
									style={styles.expand}
									size={20}
								/>
							</TouchableOpacity>
						</View>

						{cover || <CardSummary style={styles.item} text={trimmedText} />}

						<DiscussionFooter style={[ styles.item, styles.footer ]} thread={thread} />
					</View>
				</TouchFeedback>
			</Card>
		);
	}
}

DiscussionItem.propTypes = {
	thread: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		title: React.PropTypes.string.isRequired,
		text: React.PropTypes.string.isRequired,
		from: React.PropTypes.string.isRequired,
		to: React.PropTypes.string.isRequired
	}).isRequired,
	navigator: React.PropTypes.object.isRequired,
	isCurrentUserAdmin: React.PropTypes.func.isRequired,
	isThreadHidden: React.PropTypes.func.isRequired,
	isUserBanned: React.PropTypes.func.isRequired,
	hideThread: React.PropTypes.func.isRequired,
	unhideThread: React.PropTypes.func.isRequired,
	banUser: React.PropTypes.func.isRequired,
	unbanUser: React.PropTypes.func.isRequired
};
