import React from "react-native";
import oembed from "../extras/oembed/oembed";
import EmbedThumbnail from "./embed-thumbnail";
import EmbedTitle from "./embed-title";
import EmbedSummary from "./embed-summary";
import Linking from "../modules/linking";

const {
	TouchableOpacity,
	View
} = React;

export default class Embed extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			embed: null
		};
	}

	componentWillMount() {
		this._fetchData();
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	_onPress() {
		Linking.openURL(this.props.url);
	}

	_fetchData() {
		if (this.props.data) {
			this.setState({
				embed: this.props.data
			});
		} else {
			this._fetchEmbedData(this.props.url);
		}
	}

	async _fetchEmbedData(url) {
		try {
			const embed = await oembed.get(url);

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
				<View {...this.props}>
					{(() => {
						if (this.props.showThumbnail !== false) {
							if (embed.type === "video") {
								return (
									<TouchableOpacity onPress={this._onPress.bind(this)} activeOpacity={0.5}>
										<View>
											<EmbedThumbnail embed={embed} style={this.props.thumbnailStyle} />
										</View>
									</TouchableOpacity>
								);
							} else {
								return <EmbedThumbnail embed={embed} style={this.props.thumbnailStyle} />;
							}
						} else {
							return null;
						}
					})()}

					{this.props.showTitle !== false ?
						<EmbedTitle embed={embed} style={this.props.titleStyle} /> :
						null
					}

					{this.props.showSummary !== false ?
						<EmbedSummary embed={embed} style={this.props.summaryStyle} /> :
						null
					}
				</View>
			);
		} else {
			return null;
		}
	}
}

Embed.propTypes = {
	data: React.PropTypes.object,
	url: React.PropTypes.string.isRequired,
	showThumbnail: React.PropTypes.bool,
	showTitle: React.PropTypes.bool,
	showSummary: React.PropTypes.bool,
	containerStyle: React.PropTypes.any,
	thumbnailStyle: React.PropTypes.any,
	titleStyle: React.PropTypes.any,
	summaryStyle: React.PropTypes.any
};
