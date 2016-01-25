/* @flow */

import React from "react-native";
import LocalitiesFiltered from "../views/LocalitiesFiltered";
import Geolocation from "../modules/Geolocation";
import Container from "./Container";

class LocalitiesFilteredContainer extends React.Component {
	_getResults = async filter => {
		const opts: {
			ref?: string;
			limit?: number;
			location?: {
				lat: number;
				lon: number
			};
		} = filter ? { ref: filter + "*" } : { limit: 5 };

		try {
			const position = await Geolocation.getCurrentPosition();
			const { latitude: lat, longitude: lon } = position.coords;

			opts.location = {
				lat,
				lon
			};
		} catch (e) {
			// Ignore
		}

		if (opts.ref || opts.location) {
			return this.query("getRooms", opts);
		} else {
			return [];
		}
	};

	render() {
		return (
			<LocalitiesFiltered {...this.props} getResults={this._getResults} />
		);
	}
}

export default Container(LocalitiesFilteredContainer);
