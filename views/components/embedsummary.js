import React from "react-native";
import AppText from "./app-text";

const {
	View
} = React;

export default class EmbedSummary extends React.Component {
	render(){
		return(
			<View>
				{this.props.embed.description ?
				(<AppText numberOfLines = {2}><AppText style={{fontWeight:'bold'}}>Description : </AppText>{this.props.embed.description}</AppText>):null
				}
			</View>
		);
	}
}