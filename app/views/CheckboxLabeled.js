import React from "react-native";
import AppText from "./AppText";
import Checkbox from "./Checkbox";

const {
	StyleSheet,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center"
	}
});

const CheckboxLabeled = props => {
	return (
		<View style={styles.container}>
			<Checkbox {...props} />
			<AppText style={props.textStyle}>{props.children}</AppText>
		</View>
	);
};

CheckboxLabeled.propTypes = {
	textStyle: Text.propTypes.style,
	children: React.PropTypes.node
};

export default CheckboxLabeled;
