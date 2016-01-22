/* @flow */

import React from "react-native";
import NextButton from "./NextButton";
import AppText from "../AppText";
import StatusbarContainer from "../StatusbarContainer";
import OnboardTitle from "./OnboardTitle";
import OnboardParagraph from "./OnboardParagraph";
import OnboardError from "./OnboardError";
import LocalitiesFilterContainer from "../../containers/LocalitiesFilteredContainer";
import Modal from "../Modal";
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

	error: {
		borderBottomColor: Colors.error,
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
		textAlign: "center",
	},

	placeholder: {
		color: Colors.grey,
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

	_dismissModal = () => {
		Modal.renderComponent(null);
	};

	_onSelectLocality = (place: Object) => {
		this.props.onChangePlace(place);
		this._dismissModal();
	};

	_onPress = () => {
		Modal.renderComponent(<LocalitiesFilterContainer onDismiss={this._dismissModal} onSelectLocality={this._onSelectLocality} />);
	};

	render() {
		return (
			<StatusbarContainer style={styles.container}>
				<ScrollView contentContainerStyle={[ styles.container, styles.inner ]}>
					<OnboardTitle>Where do you live?</OnboardTitle>

				<TouchableOpacity onPress={this._onPress}>
					<View style={[ styles.input, this.props.error ? styles.error : null ]}>
						<AppText style={[ styles.inputText, this.props.place ? null : styles.placeholder ]}>
							{this.props.place ? this.props.place.guides.displayName : "Enter the name of your locality"}
						</AppText>
					</View>
				</TouchableOpacity>

				<OnboardParagraph>We will help you find relevant communities around your locality.</OnboardParagraph>
				<OnboardError message={this.props.error ? this.props.error.message : null} />
				</ScrollView>
				<NextButton label="Get started" onPress={this.props.onComplete} />
				<Modal />
			</StatusbarContainer>
		);
	}
}

export default LocationDetails;
