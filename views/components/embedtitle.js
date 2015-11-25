import React from "react-native";

const {
	StyleSheet,
	View,
	Text,
} = React;

export default class EmbedTitle extends React.Component {
	render(){
		return (
			<View>
				{this.props.embed.title?
				(<Text numberOfLines ={1} style={{fontWeight:'bold'}}>Title : {this.props.embed.title}</Text>):null
				}
			</View>
		);
	}
}