import React from "react-native";
import Colors from "../../colors.json";
import Icon from "./icon";
import Loading from "./loading";
import Linking from "../../modules/linking";
import preview from "../../lib/preview";

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
	thumbnailContainer: {
		flex: 1
	},
	thumbnail: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	playContainer: {
		backgroundColor: Colors.fadedBlack,
		borderColor: Colors.white,
		borderWidth: 2,
		borderRadius: 24
	},
	play: {
		color: Colors.white
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
			this.state.embed !== nextState.embed
		);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	async _fetchEmbedData() {
		const embed = await preview(this.props.uri);
		

		if (this._mounted) {
			this.setState({
				embed
			});
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
									<View style={styles.playContainer}>
										<Icon
											name="play-arrow"
											style={styles.play}
											size={48}
										/>
									</View> :
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
	uri: React.PropTypes.string.isRequired
};
