import React from "react-native";

const {
	StyleSheet,
	View,
	Image,
} = React;


export default class EmbedImage extends React.Component {
	render(){
		return (
			<View>
			{this.props.embed.thumbnail_url ?(<Image source={{uri : this.props.embed.thumbnail_url }} />):null}
			</View>
		);
	}
}