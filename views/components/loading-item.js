import React from "react-native";
import Colors from "../../colors.json";
import Loading from "./loading";

const {
	StyleSheet,
	PixelRatio,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		alignSelf: "stretch",
		alignItems: "center"
	},
	loadingContainer: {
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderWidth: 1 / PixelRatio.get(),
		height: 36,
		width: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		margin: 24,
		elevation: 1
	},
	loading: {
		height: 24,
		width: 24
	}
});

export default class LoadingItem extends React.Component {
	shouldComponentUpdate() {
		return false;
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.loadingContainer}>
					<Loading style={styles.loading} />
				</View>
			</View>
		);
	}
}
