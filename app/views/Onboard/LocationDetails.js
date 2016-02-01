/* @flow */

import React from "react-native";
import NextButton from "./NextButton";
import StatusbarWrapper from "../StatusbarWrapper";
import OnboardTitle from "./OnboardTitle";
import OnboardError from "./OnboardError";
import PlaceManager from "../Account/PlaceManager";
import Modal from "../Modal";
import Colors from "../../../Colors.json";

const {
	ScrollView,
	StyleSheet,
	View
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
		height: 210,
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
		places: React.PropTypes.array.isRequired,
		error: React.PropTypes.object,
		isLoading: React.PropTypes.bool,
		isDisabled: React.PropTypes.bool,
		onComplete: React.PropTypes.func.isRequired,
		onChangePlace: React.PropTypes.func.isRequired
	};

	render() {
		return (
			<View style={styles.container}>
				<StatusbarWrapper />
				<ScrollView contentContainerStyle={[ styles.container, styles.inner ]}>
					<OnboardTitle>Tell us a bit more?</OnboardTitle>

					<PlaceManager
						style={styles.places}
						places={this.props.places}
						onChange={this.props.onChangePlace}
					/>

					<OnboardError
						message={this.props.error ? this.props.error.message : null}
						hint="PS: We are not stalking. This is to help you find relevant communities! 😊"
					/>
				</ScrollView>
				<NextButton
					label="Get started"
					loading={this.props.isLoading}
					disabled={this.props.isDisabled}
					onPress={this.props.onComplete}
				/>
				<Modal />
			</View>
		);
	}
}

export default LocationDetails;
