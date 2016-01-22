/* @flow */

import React from "react-native";
import NextButton from "./NextButton";
import StatusbarContainer from "../StatusbarContainer";
import OnboardTitle from "./OnboardTitle";
import OnboardError from "./OnboardError";
import PlaceManager from "../Account/PlaceManager";
import Modal from "../Modal";
import Colors from "../../../Colors.json";

const {
	ScrollView,
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

	places: {
		height: 186,
		width: 240
	},
});

export default class LocationDetails extends React.Component {
	static propTypes = {
		place: React.PropTypes.shape({
			guides: React.PropTypes.shape({
				displayName: React.PropTypes.string
			})
		}),
		error: React.PropTypes.object,
		onComplete: React.PropTypes.func.isRequired,
		onChangePlace: React.PropTypes.func.isRequired
	};

	render() {
		return (
			<StatusbarContainer style={styles.container}>
				<ScrollView contentContainerStyle={[ styles.container, styles.inner ]}>
					<OnboardTitle>Tell us a bit more?</OnboardTitle>

					<PlaceManager style={styles.places} onChangePlace={this.props.onChangePlace} />

					<OnboardError
						message={this.props.error ? this.props.error.message : null}
						hint="PS: We are not stalking. This is to help you find relevant communities! 😊"
					/>
				</ScrollView>
				<NextButton label="Get started" onPress={this.props.onComplete} />
				<Modal />
			</StatusbarContainer>
		);
	}
}

export default LocationDetails;
