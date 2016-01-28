/* @flow */

import React from "react-native";
import LocalitiesFiltered from "../views/LocalitiesFiltered";
import Geolocation from "../modules/Geolocation";
import Container from "./Container";

class LocalitiesFilteredContainer extends React.Component {
	static propTypes = {
		excludeList: React.PropTypes.arrayOf(React.PropTypes.string)
	};

	_getResults = async filter => {
		const opts: {
			ref?: string;
			limit?: number;
			location?: {
				lat: number;
				lon: number
			}
		} = filter ? {
			ref: filter.trim().replace(/\W+/g, "-") + "*"
		} : { limit: 5 };

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
			const { excludeList } = this.props;
			const results = await this.query("getRooms", opts);

			if (excludeList && excludeList.length) {
				return results.filter(room => room && excludeList.indexOf(room.id) === -1);
			} else {
				return results;
			}
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
