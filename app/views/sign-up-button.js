import React from "react-native";
import Icon from "./icon";
import Colors from "../../colors.json";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	loading: {
		opacity: 0.5
	},
	button: {
		backgroundColor: Colors.success,
		height: 56,
		width: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center"
	},
	buttonText: {
		color: Colors.white,
		textAlign: "center"
	}
});

const SignUpButton = ({ loading }) => {
	return (
		<View style={[ styles.button, loading ? styles.loading : null ]}>
			<Icon
				name={loading ? "more-horiz" : "arrow-forward"}
				style={styles.buttonText}
				size={24}
			/>
		</View>
	);
};

SignUpButton.propTypes = {
	loading: React.PropTypes.bool
};

export default SignUpButton;
