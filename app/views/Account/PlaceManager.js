/* @flow */

import React from "react-native";
import PlaceItem from "./PlaceItem";
import PlaceButton from "./PlaceButton";
import LocalitiesFilterContainer from "../../containers/LocalitiesFilteredContainer";
import Modal from "../Modal";

const {
	View
} = React;

export default class PlaceManager extends React.Component {

	_handleDismissModal = () => {
		Modal.renderComponent(null);
	};

	_handleSelectLocality = (place: Object) => {
		this.props.onChangePlace(place);
		this._handleDismissModal();
	};

	_handlePress = () => {
		Modal.renderComponent(
			<LocalitiesFilterContainer
				onDismiss={this._handleDismissModal}
				onSelectLocality={this._handleSelectLocality}
			/>
		);
	};

	render() {
		return (
			<View {...this.props}>
				<PlaceItem name="Jeevan Beema Nagar" type="home" />
				<PlaceButton label="Add your hometown" onPress={this._handlePress} />
			</View>
		);
	}
}

export default PlaceManager;
