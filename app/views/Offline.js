import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import Page from "./Page";

const {
	StyleSheet,
	Image
} = React;

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: Colors.primary
	},
	image: {
		marginHorizontal: 16,
		marginVertical: 48
	},
	header: {
		color: Colors.white,
		fontSize: 20,
		lineHeight: 30
	},
	footer: {
		color: Colors.white,
	}
});

const Offline = props => (
	<Page {...props} style={[ styles.container, props.style ]}>
		<AppText style={styles.header}>Network unavailable!</AppText>
		<Image style={styles.image} source={require("../../assets/astronaut.png")} />
		<AppText style={styles.footer}>Waiting for connection…</AppText>
	</Page>
);

export default Offline;
