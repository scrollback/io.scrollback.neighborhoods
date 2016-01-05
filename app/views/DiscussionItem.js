import React from "react-native";
import Colors from "../../Colors.json";
import NotificationBadgeContainer from "../containers/NotificationBadgeContainer";
import Card from "./Card";
import CardTitle from "./CardTitle";
import DiscussionSummary from "./DiscussionSummary";
import DiscussionFooter from "./DiscussionFooter";
import TouchFeedback from "./TouchFeedback";
import Modal from "./Modal";
import Icon from "./Icon";
import Linking from "../modules/Linking";
import Clipboard from "../modules/Clipboard";
import Share from "../modules/Share";
import routes from "../utils/routes";
import textUtils from "../lib/text-utils";
import url from "../lib/url";

const {
	ToastAndroid,
	StyleSheet,
	TouchableOpacity,
	View
} = React;

const styles = StyleSheet.create({
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
			Share.shareItem("Share discussion", url.get("thread", thread));
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
		const {
			thread,
			hidden
		} = this.props;

		return (
			<Card {...this.props}>
				<TouchFeedback onPress={this._onPress.bind(this)}>
					<View style={hidden ? styles.hidden : null}>
						<View style={styles.topArea}>
							<CardTitle style={[ styles.item, styles.title ]}>
								{this.props.thread.title}
							</CardTitle>

							<NotificationBadgeContainer thread={this.props.thread.id} style={styles.badge} />

							<TouchableOpacity onPress={this._showMenu.bind(this)}>
								<Icon
									name="expand-more"
									style={styles.expand}
									size={20}
								/>
							</TouchableOpacity>
						</View>

						<DiscussionSummary text={thread.text} />
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
