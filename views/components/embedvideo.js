import React from "react-native";
import Icon from "./icon";
import Colors from "../../colors.json";

const {
	StyleSheet,
	View,
	Text,
	Image
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
		height: 180,
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

export default class EmbedVideo extends React.Component {
	render(){
		return (
			<View>
			{this.props.embed.thumbnail_url && this.props.embed.type && (this.props.embed.type.indexOf("video") !== -1) ?	
			(<Image source={{uri : this.props.embed.thumbnail_url }} style = {styles.thumbnail}>
					<View style={styles.playContainer}>
						<Icon
							name="play-arrow"
							style={styles.play}
							size={48}
						/>
					</View>
				</Image>): null}
			</View>
		);
	}
}