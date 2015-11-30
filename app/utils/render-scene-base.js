import React from "react-native";
import Modal from "../views/modal";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	scene: {
		flex: 1
	}
});

export default (route, navigator) => {
	// Hide modal on navigate
	if (Modal.isShown()) {
		Modal.renderComponent(null);
	}

	return (
		<route.component
			{...route.passProps}
			navigator={navigator}
			style={styles.scene}
		/>
	);
};
