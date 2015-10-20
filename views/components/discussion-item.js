import React from "react-native";
import Card from "./card";
import CardTitle from "./card-title";
import CardSummary from "./card-summary";
import CardAuthor from "./card-author";
import DiscussionFooter from "./discussion-footer";
import Embed from "./embed";
import TouchFeedback from "./touch-feedback";
import Modal from "./modal";
import Icon from "./icon";
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
	author: {
		marginVertical: 8
	},
	cover: {
		marginTop: 4,
		marginBottom: 8,
		height: 180
	},
	item: {
		marginHorizontal: 16
	},
	footer: {
		marginBottom: 8
	},
	topArea: {
		flexDirection: "row"
	},
	title: {
		flex: 1,
		marginTop: 16
	},
	expand: {
		marginHorizontal: 16,
		marginVertical: 12,
		color: "#000",
		fontSize: 24,
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
		const options = [ "Copy title", "Copy summary", "Share discussion" ];

		Modal.showActionSheetWithOptions({ options }, index => {
			switch (index) {
			case 0:
				Clipboard.setText(this.props.thread.title);
				break;
			case 1:
				Clipboard.setText(this.props.thread.text);
				break;
			case 2:
				const { protocol, host } = config.server;
				const { id, to } = this.props.thread;

				Share.shareItem("Share discussion", `${protocol}//${host}/${to}/${id}`);
			}
		});
	}

	_onPress() {
		this.props.navigator.push(routes.chat({
			thread: this.props.thread.id,
			room: this.props.thread.to
		}));
	}

	render() {
		const { thread } = this.props;

		const trimmedText = (thread.text || thread.title).trim();

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

							<TouchableOpacity onPress={this._showMenu.bind(this)}>
								<Icon name="expand-more" style={styles.expand} />
							</TouchableOpacity>
						</View>

						{cover || <CardSummary style={styles.item} text={trimmedText} />}

						<CardAuthor style={[ styles.item, styles.author ]} nick={thread.from} />

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
