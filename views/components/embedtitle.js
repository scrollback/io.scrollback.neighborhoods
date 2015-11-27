import React from "react-native";
import AppText from "./app-text";

const {
	View
} = React;

export default class EmbedTitle extends React.Component {
	render(){
		return (
			<View>
				{this.props.embed.title?
				(<AppText numberOfLines ={1} style={{fontWeight:'bold', fontSize:15}}>Title : {this.props.embed.title}</AppText>):null
				}
			</View>
		);
	}
}