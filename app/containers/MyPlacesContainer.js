/* @flow */

import React from 'react-native';
import MyPlaces from '../views/Account/MyPlaces';
import Container from './Container';
import store from '../store/store';

class MyPlacesContainer extends React.Component {
	state = {
		user: null,
		places: [ 'missing' ]
	};

	componentDidMount() {
		this.runAfterInteractions(this._updateData);
	}

	_updateData = () => {
		const user = store.getUser();

		this.setState({
			user,
			places: this._getPlacesData(user)
		});
	};

	_getPlacesData = (user) => {
		if (user && user.params && user.params.places) {
			return user.params.places.map(it => {
				const room = store.getRoom(it.id);

				return {
					place: typeof room === 'object' ? room : { id: it.id },
					type: it.type
				};
			});
		} else {
			return [];
		}
	};

	_saveParams = (params: Object) => {
		const user = {
			...this.state.user,
			params: {
				...this.state.user.params,
				...params
			}
		};

		return this.dispatch('user', {
			from: user.id,
			to: user.id,
			user
		});
	};

	_savePlaces = (places: Array<Object>) => {
		return this._saveParams({
			places: places.map(it => ({
				id: it.place.id,
				type: it.type
			}))
		});
	};

	_handleChangePlaces = (places: Array<Object>) => {
		this.runAfterInteractions(() => this._savePlaces(this.state.places, places));
		this.setState({
			places
		});
	};

	render() {
		return (
			<MyPlaces
				{...this.props}
				{...this.state}
				onChange={this._handleChangePlaces}
			/>
		);
	}
}

export default Container(MyPlacesContainer);
