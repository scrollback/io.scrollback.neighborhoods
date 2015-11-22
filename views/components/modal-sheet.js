import React from "react-native";
import Colors from "../../colors.json";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	sheet: {
		backgroundColor: Colors.white,
		elevation: 16
	}
});

export default class ModalSheet {
	render() {
		return (
			<View {...this.props} style={[ styles.sheet, this.props.style ]}>
				{this.props.children}
			</View>
		);
	}
}
