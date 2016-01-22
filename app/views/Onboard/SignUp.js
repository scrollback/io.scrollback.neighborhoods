/* @flow */

import React from "react-native";
import SignIn from "./SignIn";
import UserDetails from "./UserDetails";
import LocationDetails from "./LocationDetails";
import GetStarted from "./GetStarted";
import HomeContainer from "../../containers/HomeContainer";
import userUtils from "../../lib/user-utils";
import Validator from "../../lib/validator";

type Place = {
	id: string;
	guides: {
		displayName?: string;
	}
};

type State = {
	place: ?Place;
	nick: ?string;
	name: ?string;
	error: ?Object;
	onboarding: boolean;
	isLoading: boolean;
}

const ERROR_MESSAGES = {
	VALIDATE_CHARS: "Nickname can contain only letters, numbers and hyphens, no spaces.",
	VALIDATE_START: "Nickname cannot start with a hyphen.",
	VALIDATE_ONLY_NUMS: "Nickname should have at least 1 letter.",
	VALIDATE_LENGTH_SHORT: "Nickname should be 3-32 characters long.",
};

export default class SignUp extends React.Component {
	static propTypes = {
		user: React.PropTypes.object,
		signUp: React.PropTypes.func.isRequired,
		saveParams: React.PropTypes.func.isRequired,
	};

	state: State = {
		nick: null,
		name: null,
		place: null,
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

	_onCompleteDetails = async (): Promise => {
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

	_onCompleteLocation = async (): Promise => {
		this._setOnboarding(true);
		this._setIsLoading(true);

		if (!this.state.place) {
			this.setState({
				error: {
					field: "place",
					message: "You need to add at least one locality!"
				}
			});
			return;
		}

		await this.props.saveParams({
			places: {
				current: this.state.place.id
			}
		});

		this._setIsLoading(false);
	};

	_onCompleteOnboard = () => {
		this._setOnboarding(false);
	};

	_onChangeNick = (nick: string) => {
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

	_onChangeName = (name: string) => {
		this.setState({
			name,
			error: null
		});
	};

	_onChangePlace = (place: Place) => {
		this.setState({
			place,
			error: null
		});
	};

	render() {
		const { user } = this.props;

		if (user) {
			if (!userUtils.isGuest(user.id)) {
				if (user.params.places && user.params.places.current) {
					if (this.state.onboarding) {
						return (
							<GetStarted
								{...this.props}
								{...this.state}
								onComplete={this._onCompleteOnboard}
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
							onComplete={this._onCompleteLocation}
							onChangePlace={this._onChangePlace}
						/>
					);
				}
			} else if (user.identities && user.identities.some(ident => ident.indexOf("mailto:") === 0)) {
				return (
					<UserDetails
						{...this.props}
						{...this.state}
						onComplete={this._onCompleteDetails}
						onChangeNick={this._onChangeNick}
						onChangeName={this._onChangeName}
					/>
				);
			}
		}

		return <SignIn {...this.props} />;
	}
}
