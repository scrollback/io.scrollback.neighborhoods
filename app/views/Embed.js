/* @flow */

import React from "react-native";
import oembed from "../extras/oembed/oembed";
import EmbedThumbnail from "./EmbedThumbnail";
import EmbedTitle from "./EmbedTitle";
import EmbedSummary from "./EmbedSummary";
import Linking from "../modules/Linking";

const {
	TouchableOpacity,
	View
} = React;

export default class Embed extends React.Component {
	static propTypes = {
		data: React.PropTypes.object,
		url: React.PropTypes.string.isRequired,
		showThumbnail: React.PropTypes.bool,
		showTitle: React.PropTypes.bool,
		showSummary: React.PropTypes.bool,
		openOnPress: React.PropTypes.bool,
		containerStyle: React.PropTypes.any,
		thumbnailStyle: React.PropTypes.any,
		titleStyle: React.PropTypes.any,
		summaryStyle: React.PropTypes.any
	};

	static defaultProps = {
		openOnPress: true
	};

	state = {
		embed: null
	};

	componentWillMount() {
		this._fetchData();
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	_handlePress = () => {
		Linking.openURL(this.props.url);
	};

	_fetchData = () => {
		if (this.props.data) {
			this.setState({
				embed: this.props.data
			});
		} else {
			this._fetchEmbedData(this.props.url);
		}
	};

	_fetchEmbedData = async url => {
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
	};

	render() {
		const { embed } = this.state;

		if (typeof embed === "object" && embed !== null) {
			const embedItem = (
				<View>
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
			);

			if (this.props.openOnPress === false) {
				return (
					<View {...this.props}>
						{embedItem}
					</View>
				);
			} else {
				return (
					<TouchableOpacity {...this.props} onPress={this._handlePress}>
						{embedItem}
					</TouchableOpacity>
				);
			}
		} else {
			return null;
		}
	}
}
