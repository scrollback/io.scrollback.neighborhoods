/* @flow */

import React from "react-native";
import SignIn from "./SignIn";
import UserDetails from "./UserDetails";
import LocationDetails from "./LocationDetails";
import GetStarted from "./GetStarted";
import HomeContainer from "../../containers/HomeContainer";
import userUtils from "../../lib/user-utils";
import Validator from "../../lib/validator";

type State = {
	places: Array<Object>;
	nick: ?string;
	name: ?string;
	error: ?Object;
	onboarding: boolean;
	isLoading: boolean;
}

const ERROR_MESSAGES = {
	VALIDATE_CHARS: "Nickname can contain only letters, numbers and hyphens, no spaces.",
	VALIDATE_START: "Nickname cannot start with a hyphen.",
	VALIDATE_handleLY_NUMS: "Nickname should have at least 1 letter.",
	VALIDATE_LENGTH_SHORT: "Nickname should be 3-32 characters long.",
};

export default class SignUp extends React.Component {
	static propTypes = {
		user: React.PropTypes.object,
		signUp: React.PropTypes.func.isRequired,
		saveParams: React.PropTypes.func.isRequired,
		saveRooms: React.PropTypes.func.isRequired,
	};

	state: State = {
		nick: null,
		name: null,
		places: [],
		error: null,
		onboarding: false,
		isLoading: false
	};

	_setOnboarding = (onboarding: boolean) => {
		this.setState({
			onboarding
		});
	};

	_setIsLoading = (isLoading: boolean) => {
		this.setState({
			isLoading
		});
	};

	_handleCompleteDetails = async (): Promise => {
		this._setOnboarding(true);

		if (!this.state.nick) {
			this.setState({
				error: {
					field: "nick",
					message: "Nickname cannot be empty!"
				}
			});
			return;
		}

		if (!this.state.name) {
			this.setState({
				error: {
					field: "name",
					message: "Fullname cannot be empty!"
				}
			});
			return;
		}

		this._setIsLoading(true);

		try {
			await this.props.signUp({
				nick: this.state.nick,
				name: this.state.name
			});
		} catch (e) {
			this.setState({
				error: {
					field: "nick",
					message: e.message
				}
			});
		}

		this._setIsLoading(false);
	};

	_handleCompleteLocation = async (): Promise => {
		this._setOnboarding(true);

		const { places } = this.state;

		if (!places.length) {
			this.setState({
				error: {
					field: "place",
					message: "You need to add at least one locality!"
				}
			});
			return;
		}

		this._setIsLoading(true);

		try {
			await this.props.saveRooms(places);
		} catch (e) {
			if (!/ALREADY_FOLLOWER/.test(e.message)) {
				this.setState({
					error: {
						field: "place",
						message: e.message
					}
				});
			}
		}

		this._setIsLoading(false);
	};

	_handleCompleteOnboard = () => {
		this._setOnboarding(false);
	};

	_handleChangeNick = (nick: string) => {
		let error = null;

		const validation = new Validator(nick);

		if (!validation.isValid()) {
			error = {
				field: "nick",
				message: ERROR_MESSAGES[validation.error]
			};
		}

		this.setState({
			nick,
			error
		});
	};

	_handleChangeName = (name: string) => {
		this.setState({
			name,
			error: null
		});
	};

	_handleChangePlace = (places: Array<Object>) => {
		this.setState({
			places,
			error: null
		});
	};

	render() {
		const { user } = this.props;

		if (user) {
			if (!userUtils.isGuest(user.id)) {
				if (user.params.places && user.params.places.length) {
					if (this.state.onboarding) {
						return (
							<GetStarted
								{...this.props}
								{...this.state}
								onComplete={this._handleCompleteOnboard}
							/>
						);
					} else {
						return <HomeContainer />;
					}
				} else {
					return (
						<LocationDetails
							{...this.props}
							{...this.state}
							onComplete={this._handleCompleteLocation}
							onChangePlace={this._handleChangePlace}
							isDisabled={!this.state.places.length}
						/>
					);
				}
			} else if (user.identities && user.identities.some(ident => ident.indexOf("mailto:") === 0)) {
				return (
					<UserDetails
						{...this.props}
						{...this.state}
						onComplete={this._handleCompleteDetails}
						onChangeNick={this._handleChangeNick}
						onChangeName={this._handleChangeName}
						isDisabled={this.state.error || !(this.state.nick && this.state.name)}
					/>
				);
			}
		}

		return <SignIn {...this.props} />;
	}
}
