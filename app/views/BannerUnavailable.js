import React from "react-native";
import Colors from "../../Colors.json";
import config from "../store/config";

const {
	StyleSheet,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	banner: {
		backgroundColor: Colors.info,
		padding: 16
	},

	bannerText: {
		fontSize: 16,
		lineHeight: 24,
		color: Colors.white
	}
});

export default class extends React.Component {
	render() {
		return (
			<View style={styles.banner}>
				<Text style={styles.bannerText}>
					{config.app_name} is yet to launch in your neighborhood - meanwhile join the open house and connect with Neighbors from all around.
				</Text>
			</View>
		);
	}
}
