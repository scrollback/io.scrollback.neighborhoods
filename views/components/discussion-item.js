import React from "react-native";
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
		color: "#000",
		opacity: 0.5
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

	_showMenu() {
		const menu = {};

		menu["Copy title"] = () => Clipboard.setText(this.props.thread.title);

		const textMetadata = textUtils.getMetadata(this.props.thread.text);

		if (textMetadata && textMetadata.type === "image") {
			menu["Open image in browser"] = () => Linking.openURL(textMetadata.originalUrl);
			menu["Copy image link"] = () => Clipboard.setText(textMetadata.originalUrl);
		} else {
			menu["Copy summary"] = () => Clipboard.setText(this.props.thread.text);
		}

		menu["Share discussion"] = () => {
			const { protocol, host } = config.server;
			const { id, to } = this.props.thread;

			Share.shareItem("Share discussion", `${protocol}//${host}/${to}/${id}`);
		};

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
									size={24}
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
	navigator: React.PropTypes.object.isRequired
};
