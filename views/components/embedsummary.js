import React from "react-native";

const {
	View,
	Text
} = React;

export default class EmbedSummary extends React.Component {
	render(){
		return(
			<View>
				{this.props.embed.description ?
				(<Text numberOfLines = {2}><Text style={{fontWeight:"bold"}}>Description : </Text>{this.props.embed.description}</Text>):null
				}
			</View>
		);
	}
}