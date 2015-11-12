import React from "react-native";
import Colors from "../../colors.json";
import Loading from "./loading";

const {
	StyleSheet,
	Text,
	View,
	Image
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.primary
	},
	logo: {
		flex: 1,
		resizeMode: "contain",
		marginTop: 180
	},
	loading: {
		height: 24,
		width: 24,
		marginHorizontal: 16,
		marginVertical: 32
	},
	attribution: {
		alignItems: "center",
		alignSelf: "stretch",
		margin: 16
	},
	by: {
		color: Colors.fadedWhite,
		paddingHorizontal: 4
	},
	scrollback: {
		resizeMode: "contain"
	}
});

export default class Splash extends React.Component {
	shouldComponentUpdate() {
		return false;
	}

	render() {
		return (
			<View style={styles.container}>
				<Image style={styles.logo} source={require("image!logo")} />
				<Loading style={styles.loading} />
				<View style={styles.attribution}>
					<Text style={styles.by}>by</Text>
					<Image style={styles.scrollback} source={require("image!scrollback_logo")} />
				</View>
			</View>
		);
	}
}
