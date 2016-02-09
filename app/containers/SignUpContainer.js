/* @flow */

import React from 'react-native';
import SignUp from '../views/Onboard/SignUp';
import Container from './Container';
import Geolocation from '../modules/Geolocation';
import store from '../store/store';

const {
	Alert
} = React;

const GPS_ENABLE_MESSAGE = 'Help us find the best communities for you by enabling your GPS.';
const GPS_ENABLE_OK = 'Go to settings';
const GPS_ENABLE_CANCEL = 'Not now';

class SignUpContainer extends React.Component {
	state = {
		user: null,
		skipped: false,
		positionChecked: false
	};

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle('statechange', changes => {
			if (changes.user) {
				this._updateData();
			} else {
				const user = store.get('user');

				if (changes.entities && changes.entities[user]) {
					this._updateData();
				}
			}
		});
	}

	_checkIfAvailable = async (position) => {
		try {
			const results = await this.query('getRooms', {
				location: {
					lat: position.coords.latitude,
					lon: position.coords.longitude
				},
				limit: 1
			});

			if (!results.length) {
				this.setState({
					skipped: true
				});
			}
		} catch (e) {
			// Ignore
		}
	};

	_checkPosition = async () => {
		try {
			// Get current position
			const position = await Geolocation.getCurrentPosition();

			this._checkIfAvailable(position);
		} catch (e) {
			// Watch for position change
			const watchID = Geolocation.watchPosition(p => {
				if (p) {
					this._checkIfAvailable(p);
					Geolocation.clearWatch(watchID);
				}
			});

			// Request to enable GPS
			const isEnabled = await Geolocation.isGPSEnabled();

			if (!isEnabled) {
				Alert.alert(null, GPS_ENABLE_MESSAGE,
					[
						{ text: GPS_ENABLE_CANCEL },
						{
							text: GPS_ENABLE_OK,
							onPress: () => Geolocation.showGPSSettings()
						},
					]
				);
			}
		}
	};

	_updateData = () => {
		const user = store.getUser();

		if (user && user.params && !this.state.positionChecked && !user.params.places) {
			this.setState({
				user,
				positionChecked: true,
			});

			this._checkPosition();
		} else {
			this.setState({
				user,
			});
		}
	};

	_checkNickName = async nick => {
		const results = await this.query('getEntities', { ref: nick });

		return results && results.length;
	};

	_signIn = ({ provider, token }) => {
		return this.dispatch('init', {
			auth: {
				[provider]: { token }
			}
		});
	};

	_signUp = async ({ nick, name }) => {
		const { user } = this.state;

		if (!user) {
			throw new Error('USER_NOT_INITED');
		}

		await this.dispatch('user', {
			from: nick,
			to: nick,
			user: {
				id: nick,
				identities: [ user.identities[user.identities.length - 1] ],
				picture: user.params.pictures && user.params.pictures[0] || '',
				params: {
					pictures: user.params.pictures,
					skipped: this.state.skipped
				},
				guides: {
					fullname: name
				}
			}
		});
	};

	_cancelSignUp = () => {
		this.emit('logout');
	};

	_saveParams = (params: Object) => {
		if (!this.state.user) {
			throw new Error('USER_NOT_INITED');
		}

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

	_saveRooms = (places: Array<Object>) => {
		return this._saveParams({
			places: places.map(it => ({
				id: it.place.id,
				type: it.type
			}))
		});
	};

	_skipRooms = () => {
		return this._saveParams({
			skipped: true
		});
	};

	render() {
		return (
			<SignUp
				{...this.props}
				{...this.state}
				signIn={this._signIn}
				signUp={this._signUp}
				cancelSignUp={this._cancelSignUp}
				saveParams={this._saveParams}
				saveRooms={this._saveRooms}
				skipRooms={this._skipRooms}
				checkNickName={this._checkNickName}
			/>
		);
	}
}

export default Container(SignUpContainer);
