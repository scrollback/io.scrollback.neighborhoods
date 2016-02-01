/* @flow */

import React from "react-native";
import PlaceItem from "./PlaceItem";
import PlaceButton from "./PlaceButton";
import LocalitiesFilteredContainer from "../../containers/LocalitiesFilteredContainer";
import StatesFilteredContainer from "../../containers/StatesFilteredContainer";
import Modal from "../Modal";

const {
	View,
	InteractionManager
} = React;

type Place = {
	id: string;
}

const TYPES = [
	{
		type: "home",
		title: "Home",
		label: "Add where you live",
		hint: "Join your neighborhood group"
	},
	{
		type: "work",
		title: "Work",
		label: "Add where you work or study",
		hint: "Join your office or campus group"
	},
	{
		type: "state",
		title: "Hometown",
		label: "Add your hometown",
		hint: "Join people from your state in the city"
	}
];

export default class PlaceManager extends React.Component {

	static propTypes = {
		onChange: React.PropTypes.func.isRequired,
		places: React.PropTypes.arrayOf(React.PropTypes.shape({
			place: React.PropTypes.object,
			type: React.PropTypes.oneOf([ "home", "work", "state" ])
		}))
	};

	_handleDismissModal = () => {
		Modal.renderComponent(null);
	};

	_handleSelectItem = (type: string, place: Place) => {
		this._handleDismissModal();

		InteractionManager.runAfterInteractions(() => {
			const { places } = this.props;

			this.props.onChange([ ...places, {
				place,
				type
			} ]);
		});
	};

	_handleRemoveLocality = (place: Place, type: string) => {
		this.props.onChange(this.props.places.filter(it => !(it.place.id === place.id && it.type === type)));
	};

	_handlePress = type => {
		if (type === "state") {
			Modal.renderComponent(
				<StatesFilteredContainer
					onDismiss={this._handleDismissModal}
					onSelectItem={place => this._handleSelectItem(type, place)}
				/>
			);
		} else {
			Modal.renderComponent(
				<LocalitiesFilteredContainer
					onDismiss={this._handleDismissModal}
					onSelectItem={place => this._handleSelectItem(type, place)}
				/>
			);
		}
	};

	render() {
		const { places } = this.props;

		const placesMap = {};

		for (let i = 0, l = places.length; i < l; i++) {
			placesMap[places[i].type] = places[i].place;
		}

		return (
			<View {...this.props}>
				{TYPES.map(item => {
					if (placesMap[item.type]) {
						return (
							<PlaceItem
								key={item.type}
								type={item.type}
								place={placesMap[item.type]}
								onRemove={this._handleRemoveLocality}
							/>
						);
					}

					return (
						<PlaceButton
							key={item.type}
							type={item.type}
							label={item.label}
							hint={item.hint}
							onPress={this._handlePress}
						/>
					);
				})}
			</View>
		);
	}
}

export default PlaceManager;
