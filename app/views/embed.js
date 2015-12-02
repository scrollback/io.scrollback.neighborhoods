import React from "react-native";
import link from "./link";
import oembed from "../../oembed/oembed";
import EmbedThumbnail from "./embed-thumbnail";
import EmbedTitle from "./embed-title";
import EmbedSummary from "./embed-summary";
import Linking from "../../modules/linking";
import Colors from "../../colors.json";

const {
	TouchableHighlight,
	View
} = React;

export default class Embed extends React.Component {
	constructor(props) {
		super(props);

		this._url = this._parseUrl(this.props.text);

		this.state = {
			embed: null
		};
	}

	componentDidMount() {
		this._mounted = true;
		this._fetchEmbedData();
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	_onPress() {
		Linking.openURL(this._url);
	}

	_parseUrl(text) {
		const words = text.replace(/(\r\n|\n|\r)/g, " ").split(" ");

		let url;

		for (let i = 0, l = words.length; i < l; i++) {
			url = link.buildLink(words[i].replace(/[\.,\?!:;]+$/, ""));

			if (/^https?:\/\//.test(url)) {
				return url;
			}
		}
	}

	async _fetchEmbedData() {
		try {
			const embed = await oembed.get(this._url);

			if (this._mounted) {
				this.setState({
					embed
				});
			}
		} catch (e) {
			// Ignore
		}
	}

	render() {
		const { embed } = this.state;

		if (typeof embed === "object" && embed !== null) {
			return (
				<TouchableHighlight
					{...this.props}
					onPress={this._onPress.bind(this)}
					underlayColor={Colors.underlay}
				>
					<View style={this.props.containerStyle}>
						{this.props.showThumbnail !== false ?
							<EmbedThumbnail embed={embed} style={this.props.thumbnailStyle} /> :
							null
						}

						{this.props.showTitle !== false ?
							<EmbedTitle embed={embed} style={this.props.titleStyle} /> :
							null
						}

						{this.props.showSummary !== false ?
							<EmbedSummary embed={embed} style={this.props.summaryStyle} /> :
							null
						}
					</View>
				</TouchableHighlight>
			);
		} else {
			return null;
		}
	}
}


Embed.propTypes = {
	text: React.PropTypes.string.isRequired,
	showThumbnail: React.PropTypes.bool,
	showTitle: React.PropTypes.bool,
	showSummary: React.PropTypes.bool,
	containerStyle: React.PropTypes.any,
	thumbnailStyle: React.PropTypes.any,
	titleStyle: React.PropTypes.any,
	summaryStyle: React.PropTypes.any
};
