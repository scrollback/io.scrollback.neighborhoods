/* @flow */

import React from 'react-native';
import StatesFiltered from '../views/StatesFiltered';
import Container from './Container';

const STATES = [
	'Andhra Pradesh',
	'Arunachal Pradesh',
	'Assam',
	'Bihar',
	'Chhattisgarh',
	'Goa',
	'Gujarat',
	'Haryana',
	'Himachal Pradesh',
	'Jammu and Kashmir',
	'Jharkhand',
	'Karnataka',
	'Kerala',
	'Madhya Pradesh',
	'Maharashtra',
	'Manipur',
	'Meghalaya',
	'Mizoram',
	'Nagaland',
	'Odisha',
	'Punjab',
	'Rajasthan',
	'Sikkim',
	'Tamil Nadu',
	'Telangana',
	'Tripura',
	'Uttar Pradesh',
	'Uttarakhand',
	'West Bengal'
];

class StatesFilteredContainer extends React.Component {
	_getResults = filter => {
		const data = filter ? STATES.filter(state => state.toLowerCase().indexOf(filter.toLowerCase()) > -1) : STATES;

		return data.map(state => ({
			id: state.toLowerCase().replace(/\s+/g, '-'),
			guides: {
				displayName: state
			}
		}));
	};

	render() {
		return (
			<StatesFiltered {...this.props} getResults={this._getResults} />
		);
	}
}

export default Container(StatesFilteredContainer);
