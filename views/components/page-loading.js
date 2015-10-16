import React from "react-native";
import Loading from "./loading";
import Page from "./page";

const {
	StyleSheet,
	PixelRatio,
	View
} = React;

const styles = StyleSheet.create({
	loadingContainer: {
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .08)",
		borderWidth: 1 / PixelRatio.get(),
		height: 36,
		width: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center"
	},
	loading: {
		height: 24,
		width: 24
	}
});

export default class PageLoading extends React.Component {
	render() {
		return (
			<Page {...this.props}>
				<View style={styles.loadingContainer}>
					<Loading style={styles.loading} />
				</View>
			</Page>
		);
	}
}
