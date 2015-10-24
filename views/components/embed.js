/* global fetch */

import React from "react-native";
import Icon from "./icon";
import Loading from "./loading";
import Linking from "../../modules/linking";

const {
	StyleSheet,
	View,
	Image,
	TouchableHighlight
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	progress: {
		height: 24,
		width: 24
	},
	thumbnailContainer: { flex: 1 },
	thumbnail: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	play: {
		backgroundColor: "rgba(0, 0, 0, .7)",
		borderColor: "#fff",
		borderWidth: 2,
		color: "#fff",
		fontSize: 48,
		borderRadius: 24
	}
});

export default class Embed extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			embed: null
		};
	}

	componentDidMount() {
		this._mounted = true;

		this._fetchEmbedData();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			this.props.uri !== nextProps.uri ||
			this.props.endpoint !== nextProps.endpoint ||
			this.state.embed !== nextState.embed
		);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	async _fetchEmbedData() {
		const response = await fetch(this.props.endpoint);
		const embed = await response.json();

		if (this._mounted) {
			this.setState({ embed }); // eslint-disable-line react/no-did-mount-set-state
		}
	}

	_onPress() {
		Linking.openURL(this.props.uri);
	}

	render() {
		const { embed } = this.state;

		return (
			<View {...this.props}>
				{embed && embed.thumbnail_url ?
					(<TouchableHighlight onPress={this._onPress.bind(this)} style={styles.container}>
						<View style={styles.container}>
							<Image source={{ uri: embed.thumbnail_url }} style={styles.thumbnail}>
								{embed.type === "video" ?
									<Icon name="play-arrow" style={styles.play} /> :
									null
								}
							</Image>
						</View>
					</TouchableHighlight>) :
					(<View style={styles.overlay}>
						<Loading style={styles.progress} />
					</View>)
				}
			</View>
		);
	}
}

Embed.propTypes = {
	uri: React.PropTypes.string.isRequired,
	endpoint: React.PropTypes.string.isRequired
};
