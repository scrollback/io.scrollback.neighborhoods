/* @flow */

import React from "react-native";
import NextButton from "./NextButton";
import AppText from "../AppText";
import StatusbarContainer from "../StatusbarContainer";
import Banner from "../Banner";
import OnboardTitle from "./OnboardTitle";
import OnboardParagraph from "./OnboardParagraph";
import Colors from "../../../Colors.json";

const {
	ScrollView,
	View,
	StyleSheet,
	TouchableOpacity,
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

	input: {
		width: 220,
		paddingVertical: 8,
		margin: 16,
		borderBottomColor: Colors.placeholder,
		borderBottomWidth: 1,
	},

	inputText: {
		color: Colors.darkGrey,
	},

	placeholder: {
		color: Colors.grey,
	},
});

type Props = {
	address?: string;
	errorMessage?: string;
	validationError: Object;
	onComplete: Function;
	onSelectAddress: Function;
}

const EXAMPLE_ADDRESS = "Example:\nRaheja Residency, 3rd Block, Koramangala";

const LocationDetails = (props: Props) => (
	<StatusbarContainer style={styles.container}>
		<Banner text={props.errorMessage} type="error" />

		<ScrollView contentContainerStyle={[ styles.container, styles.inner ]}>
			<OnboardTitle>Where do you stay?</OnboardTitle>

			<TouchableOpacity>
				<View style={styles.input}>
					<AppText style={[ styles.inputText, props.address ? null : styles.placeholder ]}>
						{props.address || EXAMPLE_ADDRESS}
					</AppText>
				</View>
			</TouchableOpacity>

			<OnboardParagraph>We will help you find relevant communities around your locality.</OnboardParagraph>
		</ScrollView>
		<NextButton label="Get started" onPress={props.onComplete} />
	</StatusbarContainer>
);

LocationDetails.propTypes = {
	address: React.PropTypes.string,
	errorMessage: React.PropTypes.string,
	validationError: React.PropTypes.objectOf(React.PropTypes.string),
	onComplete: React.PropTypes.func.isRequired,
	onSelectAddress: React.PropTypes.func.isRequired
};

export default LocationDetails;
