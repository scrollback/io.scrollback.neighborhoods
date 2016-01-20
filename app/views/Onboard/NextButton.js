import React from "react-native";
import AppText from "../AppText";
import Icon from "../Icon";
import Colors from "../../../Colors.json";

const {
	View,
	TouchableHighlight,
	StyleSheet
} = React;

const styles = StyleSheet.create({
	button: {
		height: 56,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.info,
	},

	label: {
		color: Colors.white,
		fontWeight: "bold",
		margin: 16
	},

	progress: {
		color: Colors.white,
		margin: 16
	},

	icon: {
		color: Colors.fadedBlack
	}
});

const NextButton = props => {
	if (props.loading) {
		return (
			<View style={styles.button}>
				<Icon
					style={styles.progress}
					name="more-horiz"
					size={24}
				/>
			</View>
		);
	} else {
		return (
			<TouchableHighlight {...props}>
				<View style={styles.button}>
					<AppText style={styles.label}>{props.label.toUpperCase()}</AppText>
					<Icon
						style={styles.icon}
						name="arrow-forward"
						size={16}
					/>
				</View>
			</TouchableHighlight>
		);
	}
};

NextButton.propTypes = {
	label: React.PropTypes.string,
	loading: React.PropTypes.bool
};

export default NextButton;
