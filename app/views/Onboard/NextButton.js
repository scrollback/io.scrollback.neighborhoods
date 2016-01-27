/* @flow */

import React from "react-native";
import AppText from "../AppText";
import NextButtonLabel from "./NextButtonLabel";
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
		color: Colors.fadedBlack,
		fontWeight: "bold",
		margin: 16
	},

	disabled: {
		opacity: 0.5
	},
});

const NextButton = props => {
	if (props.loading) {
		return (
			<View style={styles.button}>
				<AppText style={styles.label}>
					JUST A SEC…
				</AppText>
			</View>
		);
	}

	if (props.disabled) {
		return <NextButtonLabel label={props.label} style={[ styles.button, styles.disabled ]} />;
	}

	return (
		<TouchableHighlight onPress={props.onPress}>
			<NextButtonLabel label={props.label} style={styles.button} />
		</TouchableHighlight>
	);
};

NextButton.propTypes = {
	label: React.PropTypes.string,
	loading: React.PropTypes.bool,
	disabled: React.PropTypes.bool,
	onPress: React.PropTypes.func.isRequired
};

export default NextButton;
