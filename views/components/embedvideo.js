import React from "react-native";
import Icon from "./icon";
import Colors from "../../colors.json";

const {
	StyleSheet,
	View,
	TouchableHighlight,
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
		width:75,
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

	_onPress(){
		Linking.openURL(this.state.url);
	}

	render(){
		return (
			<View style={styles.container}>
			{this.props.embed.thumbnail_url ?	
				(<TouchableHighlight onPress={this._onPress.bind(this)} style={styles.container}>
				<View style={styles.container}>
				<Image source={{uri : this.props.embed.thumbnail_url }} style={styles.thumbnail}>
					{embed.type === "video" ?
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