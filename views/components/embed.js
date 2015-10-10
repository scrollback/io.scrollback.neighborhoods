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
		height: 240
	},
	overlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	progress: {
		height: 36,
		width: 36
	},
	thumbnailContainer: { flex: 1 },
	thumbnail: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	play: {
		backgroundColor: "rgba(0, 0, 0, .7)",
		color: "#fff",
		fontSize: 64,
		borderRadius: 32
	}
});

export default class Embed extends React.Component {
	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		this._mounted = true;

		fetch(this.props.endpoint)
			.then(response => response.json())
			.then(embed => {
				if (this._mounted) {
					this.setState({ embed }); // eslint-disable-line react/no-did-mount-set-state
				}
			});
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	onPress() {
		Linking.openURL(this.props.uri);
	}

	render() {
		const { embed } = this.state;

		return (
			<View {...this.props}>
				{embed && embed.thumbnail_url ?
					(<TouchableHighlight onPress={this.onPress.bind(this)}>
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
