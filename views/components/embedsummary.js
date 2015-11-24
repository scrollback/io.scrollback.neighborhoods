import React from "react-native";

const {
	StyleSheet,
	View,
	Text
} = React;

export default class EmbedSummary extends React.Component {
	render(){
		return(
			<View>
				{this.props.embed.description ?
				(<Text numberOfLines = {2}>{this.props.embed.description}</Text>):null
				}
			</View>
		);
	}
}