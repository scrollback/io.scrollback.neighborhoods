import React from "react-native";
import Icon from "./icon";
import Colors from "../../colors.json";

const {
	StyleSheet,
	View,
	Image
} = React;

const styles = StyleSheet.create({
	thumbnail: {
		width: 240,
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
	render() {
		if (this.props.embed.thumbnail_url) {
			return (
				<Image source={{ uri: this.props.embed.thumbnail_url }} style={[ styles.thumbnail, this.props.style ]}>
					{this.props.embed.type === "video" ?
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
			);
		} else {
			return null;
		}
	}
}

EmbedVideo.propTypes = {
	embed: React.PropTypes.shape({
		type: React.PropTypes.string.isRequired,
		thumbnail_url: React.PropTypes.string,
		thumbnail_height: React.PropTypes.number,
		thumbnail_width: React.PropTypes.number
	}).isRequired
};
