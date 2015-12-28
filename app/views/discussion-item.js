import React from "react-native";
import Colors from "../../colors.json";
import NotificationBadgeContainer from "../containers/notification-badge-container";
import Card from "./card";
import CardTitle from "./card-title";
import CardSummary from "./card-summary";
import DiscussionFooter from "./discussion-footer";
import Embed from "./embed";
import TouchFeedback from "./touch-feedback";
import Modal from "./modal";
import Icon from "./icon";
import Link from "./link";
import Linking from "../modules/linking";
import Clipboard from "../modules/clipboard";
import Share from "../modules/share";
import routes from "../utils/routes";
import textUtils from "../lib/text-utils";
import config from "../store/config";
import colors from "../../colors.json";

const {
	ToastAndroid,
	StyleSheet,
	TouchableOpacity,
	View
} = React;

const styles = StyleSheet.create({
	image: {
		marginVertical: 4,
		height: 180,
		width: null
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
	},
	hidden: {
		opacity: 0.3
	}
});

export default class DiscussionItem extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
				this.props.hidden !== nextProps.hidden ||
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

		const metadata = textUtils.getMetadata(thread.text);

		if (metadata && metadata.type === "image") {
			menu["Open image in browser"] = () => Linking.openURL(metadata.url);
			menu["Copy image link"] = () => this._copyToClipboard(metadata.url);
		} else {
			menu["Copy summary"] = () => this._copyToClipboard(thread.text);
		}

		menu["Share discussion"] = () => {
			const { protocol, host } = config.server;
			const { id, to, title } = thread;

			Share.shareItem("Share discussion", `${protocol}//${host}/${to}/${id}/${title.toLowerCase().trim().replace(/['"]/g, "").replace(/\W+/g, "-")}`);
		};

		if (this.props.isCurrentUserAdmin()) {
			if (this.props.hidden) {
				menu["Unhide discussion"] = () => this.props.unhideText();
			} else {
				menu["Hide discussion"] = () => this.props.hideText();
			}

			if (thread.from !== this.props.currentUser) {
				if (this.props.isUserBanned()) {
					menu["Unban " + thread.from] = () => this.props.unbanUser();
				} else {
					menu["Ban " + thread.from] = () => this.props.banUser();
				}
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
		const { thread, hidden } = this.props;

		const trimmedText = thread.text.trim();

		const links = Link.parseLinks(trimmedText, 1);
		const metadata = textUtils.getMetadata(trimmedText);

		let cover, hideSummary;

		if (metadata && metadata.type === "photo") {
			cover = (
				<Embed
					url={metadata.url}
					data={metadata}
					thumbnailStyle={styles.image}
					showTitle={false}
					showSummary={false}
				/>
			);

			hideSummary = true;
		} else if (links.length) {
			cover = (
				<Embed
					url={links[0]}
					thumbnailStyle={styles.image}
					showTitle={false}
					showSummary={false}
				/>
			);
		}

		return (
			<Card {...this.props}>
				<TouchFeedback onPress={this._onPress.bind(this)} pressColor={colors.underlay}>
					<View style={hidden ? styles.hidden : null}>
						<View style={styles.topArea}>
							<CardTitle
								style={[ styles.item, styles.title ]}
								text={this.props.thread.title}
							/>

							<NotificationBadgeContainer thread={this.props.thread.id} style={styles.badge} />

							<TouchableOpacity onPress={this._showMenu.bind(this)}>
								<Icon
									name="expand-more"
									style={styles.expand}
									size={20}
								/>
							</TouchableOpacity>
						</View>

						{cover}

						{hideSummary ? null :
							<CardSummary style={styles.item} text={trimmedText} />
						}

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
	currentUser: React.PropTypes.string.isRequired,
	hidden: React.PropTypes.bool.isRequired,
	isCurrentUserAdmin: React.PropTypes.func.isRequired,
	isUserBanned: React.PropTypes.func.isRequired,
	hideText: React.PropTypes.func.isRequired,
	unhideText: React.PropTypes.func.isRequired,
	banUser: React.PropTypes.func.isRequired,
	unbanUser: React.PropTypes.func.isRequired
};
