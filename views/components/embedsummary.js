import React from "react-native";

const {
	StyleSheet,
	View,
	Text
} = React;

export default class EmbedSummary extends React.Component {
	render(){
		return(
			<View style={{paddingLeft:10, paddingRight:10}}>
				{this.props.embed.description ?
				(<Text numberOfLines = {2}>Description : {this.props.embed.description}</Text>):null
				}
			</View>
		);
	}
}