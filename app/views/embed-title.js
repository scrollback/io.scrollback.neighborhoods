import React from "react-native";
import AppText from "./app-text";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	text: {
		fontWeight:'bold', 
		fontSize:15
	}
});

export default class EmbedTitle extends React.Component {
	render(){
		return (
			<View>
				{this.props.embed.title?
				(<AppText numberOfLines ={1} style= {styles.text} >{this.props.embed.title}</AppText>):null
				}
			</View>
		);
	}
}