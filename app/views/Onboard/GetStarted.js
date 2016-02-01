/* @flow */

import React from "react-native";
import NextButton from "./NextButton";
import StatusbarWrapper from "../StatusbarWrapper";
import OnboardTitle from "./OnboardTitle";
import OnboardParagraph from "./OnboardParagraph";
import Colors from "../../../Colors.json";

const {
	View,
	StyleSheet,
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},

	inner: {
		padding: 15,
		alignItems: "center",
		justifyContent: "center"
	},

	text: {
		marginVertical: 8
	}
});

const UserDetails = (props: { onComplete: Function }) => (
	<View style={styles.container}>
		<StatusbarWrapper />
		<View style={[ styles.container, styles.inner ]}>
			<OnboardTitle style={styles.text}>You are all set!</OnboardTitle>
			<OnboardParagraph style={styles.text}>Go, be the good neighbor you are.</OnboardParagraph>
		</View>
		<NextButton label="Let's go" onPress={props.onComplete} />
	</View>
);

UserDetails.propTypes = {
	onComplete: React.PropTypes.func.isRequired
};

export default UserDetails;
