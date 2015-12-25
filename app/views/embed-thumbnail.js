import React from "react-native";
import Icon from "./icon";
import Colors from "../../colors.json";

const {
	StyleSheet,
	Dimensions,
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
		padding: 4,
		borderWidth: 2,
		borderRadius: 24
	},
	play: {
		color: Colors.white
	}
});

export default class EmbedThumbnail extends React.Component {
	constructor(props) {
		super(props);

		this._dimen = this.props.embed.thumbnail_url ? this._getOptimalDimensions() : null;
	}

	_getOptimalDimensions() {
		const {
			height,
			width,
			thumbnail_width,
			thumbnail_height
		} = this.props.embed;

		const win = Dimensions.get("window");

		let ratio;

		if (thumbnail_height && thumbnail_width) {
			ratio = (thumbnail_height / thumbnail_width);
		} else if (width && height) {
			ratio = height / width;
		} else {
			ratio = 1;
		}

		let displayWidth;

		if (thumbnail_height) {
			displayWidth = Math.min(thumbnail_width, win.width - 120);
		} else if (height) {
			displayWidth = Math.min(width, win.width - 120);
		} else {
			displayWidth = 160;
		}

		return {
			height: displayWidth * ratio,
			width: displayWidth
		};
	}

	render() {
		if (this.props.embed.thumbnail_url) {
			return (
				<Image source={{ uri: this.props.embed.thumbnail_url }} style={[ styles.thumbnail, this._dimen, this.props.style ]}>
					{this.props.embed.type === "video" ?
						<View style={styles.playContainer}>
							<Icon
								name="play-arrow"
								style={styles.play}
								size={36}
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

EmbedThumbnail.propTypes = {
	embed: React.PropTypes.shape({
		type: React.PropTypes.string.isRequired,
		height: React.PropTypes.number,
		width: React.PropTypes.number,
		thumbnail_height: React.PropTypes.number,
		thumbnail_width: React.PropTypes.number,
		thumbnail_url: React.PropTypes.string
	}).isRequired
};
