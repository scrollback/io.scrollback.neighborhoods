import React from "react-native";
import Icon from "./icon";
import Colors from "../../colors.json";
import Linking from "../../modules/linking";

const {
	StyleSheet,
	View,
	TouchableHighlight,
	Image
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width:180,
		height:135
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
		height: 135,
		justifyContent: "center",
		alignItems: "center"
	},
	playContainer: {
		backgroundColor: Colors.fadedBlack,
		borderColor: Colors.white,
		justifyContent: "center",
		borderWidth: 2,
		borderRadius: 24
	},
	play: {
		color: Colors.white
	}
});

export default class EmbedVideo extends React.Component {

	_onPress() {
		Linking.openURL(this.props.url);
	}

	render() {
		return (
			<View>
			{this.props.embed.thumbnail_url ?
				(
					<TouchableHighlight onPress={this._onPress.bind(this)}>
						<View style={this.props.style}>
							<Image source={{uri : this.props.embed.thumbnail_url }} style={styles.thumbnail}>
								{this.props.embed.type === "video" ?
								<View style={styles.playContainer}>
									<Icon
										name="play-arrow"
										style={styles.play}
										size={48}
									/>
								</View>:null}
							</Image>
						</View>
				</TouchableHighlight>): null}
			</View>
		);
	}
}