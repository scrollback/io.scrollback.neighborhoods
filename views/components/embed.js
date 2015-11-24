import React from "react-native";
import Colors from "../../colors.json";
import Icon from "./icon";
import Loading from "./loading";
import Linking from "../../modules/linking";
import preview from "../../lib/preview";

const {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableHighlight
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row'
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
		flex: 0.75,
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
		console.log(embed);

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
							<Text style={{flex:0.25}}>{embed.title}</Text>
						</View>
					</TouchableHighlight>) :
					<View>
					{ embed && embed.title ? (<View><Text>{embed.title}</Text><Text>{embed.description}</Text></View>):
						(<View style={styles.overlay}>
							<Loading style={styles.progress} />
						</View>)
					}
					</View>
				}
			</View>
		);
	}
}

Embed.propTypes = {
	uri: React.PropTypes.string.isRequired
};
