/* @flow */

import React from "react-native";
import PlaceItem from "./PlaceItem";
import PlaceButton from "./PlaceButton";
import LocalitiesFilteredContainer from "../../containers/LocalitiesFilteredContainer";
import StatesFilteredContainer from "../../containers/StatesFilteredContainer";
import Modal from "../Modal";

const {
	View
} = React;

type Place = {
	id: string;
}

const TYPES = [ "current", "work", "home" ];
const LABELS = {
	current: "Add where you live",
	work: "Add where you work",
	home: "Add your hometown",
};

export default class PlaceManager extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		places: React.PropTypes.arrayOf(React.PropTypes.shape({
			place: React.PropTypes.object,
			type: React.PropTypes.oneOf(TYPES)
		}))
	};

	_getNextType = (places) => {
		const placeTypes = places.map(p => p.type);

		for (let i = 0, l = TYPES.length; i < l; i++) {
			if (placeTypes.indexOf(TYPES[i]) === -1) {
				return TYPES[i];
			}
		}
	};

	_handleDismissModal = () => {
		Modal.renderComponent(null);
	};

	_handleSelectItem = (place: Place) => {
		const { places } = this.props;

		this.props.onChange([ ...places, {
			place,
			type: this._getNextType(places)
		} ]);
		this._handleDismissModal();
	};

	_handleRemoveLocality = (place: Place) => {
		this.props.onChange(this.props.places.filter(it => it.place.id !== place.id));
	};

	_handlePress = () => {
		const next = this._getNextType(this.props.places);

		if (next === "home") {
			Modal.renderComponent(
				<StatesFilteredContainer
					onDismiss={this._handleDismissModal}
					onSelectItem={this._handleSelectItem}
				/>
			);
		} else {
			Modal.renderComponent(
				<LocalitiesFilteredContainer
					onDismiss={this._handleDismissModal}
					onSelectItem={this._handleSelectItem}
					excludeList={this.props.places.map(item => item.place.id)}
				/>
			);
		}
	};

	render() {
		const { places } = this.props;
		const next = this._getNextType(places);

		return (
			<View {...this.props}>
				{places.map(item => (
					<PlaceItem
						key={item.place.id}
						place={item.place}
						type={item.type}
						onRemove={this._handleRemoveLocality}
					/>
				))}
				{next ? <PlaceButton label={LABELS[next]} onPress={this._handlePress} /> : null}
			</View>
		);
	}
}

export default PlaceManager;
