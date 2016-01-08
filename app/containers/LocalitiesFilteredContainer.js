import React from "react-native";
import LocalitiesFiltered from "../views/LocalitiesFiltered";
import Geolocation from "../modules/Geolocation";
import debounce from "../lib/debounce";
import Container from "./Container";

const {
	InteractionManager
} = React;

class LocalitiesFilteredContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				results: []
			}
		};

		this._fetchMatchingRooms = debounce(this._fetchMatchingRoomsImmediate);

		this._cachedResults = {};
	}

	_fetchMatchingRoomsImmediate = async filter => {
		const opts = { ref: filter + "*" };

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

		const data = await this.query("getRooms", opts) || [];

		this._cachedResults[filter] = data;

		if (filter !== this.state.filter) {
			return;
		}

		this._onDataArrived(data);
	};

	_onDataArrived = results => {
		this.setState({
			data: { results }
		});
	};

	_onSearchChange = text => {
		const filter = text.toLowerCase();

		if (filter) {
			InteractionManager.runAfterInteractions(() => {
				if (this._mounted) {
					if (this._cachedResults[filter]) {
						this.setState({
							filter,
							data: {
								results: this._cachedResults[filter]
							}
						});
					} else {
						this.setState({
							filter,
							data: {
								results: [ "missing" ]
							}
						});
					}
				}
			});

			if (!this._cachedResults[filter]) {
				this._fetchMatchingRooms(filter);
			}
		} else {
			this.setState({
				filter,
				data: {
					results: []
				}
			});
		}
	};

	render() {
		return (
			<LocalitiesFiltered
				{...this.props}
				{...this.state}
				onSearchChange={this._onSearchChange}
			/>
		);
	}
}

export default Container(LocalitiesFilteredContainer);
