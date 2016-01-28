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
	ERR_VALIDATE_CHARS: "Nickname can contain only letters, numbers and hyphens without spaces.",
	ERR_VALIDATE_START: "Nickname cannot start with a hyphen.",
	ERR_VALIDATE_NO_ONLY_NUMS: "Nickname should have at least 1 letter in it.",
	ERR_VALIDATE_LENGTH_SHORT: "Nickname should be more than 3 letters long.",
	ERR_VALIDATE_LENGTH_LONG: "Nickname should be less than 32 letters long.",
	ERR_USER_EXISTS: "Oops! Somebody claimed this username just before you did.",
	NICK_TAKEN: "This username is already taken. Maybe try another?",
	USER_NOT_INITED: "An error occurred. Maybe try restarting the app?",
	NO_LOCALITY_GIVEN: "You need to add at least one locality!",
	EMPTY_NICKNAME: "Nickname cannot be empty!",
	EMPTY_FULLNAME: "Fullname cannot be empty!",
	UNKNOWN_ERROR: "An error occurred. Maybe try after a while?",
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
					message: ERROR_MESSAGES.EMPTY_NICKNAME
				}
			});
			return;
		}

		if (!this.state.name) {
			this.setState({
				error: {
					field: "name",
					message: ERROR_MESSAGES.EMPTY_FULLNAME
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
					message: ERROR_MESSAGES[e.message]
				}
			});
		}
	};

	_handleCompleteLocation = async (): Promise => {
		this._setOnboarding(true);

		const { places } = this.state;

		if (!places.length) {
			this.setState({
				error: {
					field: "place",
					message: ERROR_MESSAGES.NO_LOCALITY_GIVEN
				}
			});
			return;
		}

		this._setIsLoading(true);

		try {
			await this.props.saveRooms(places);
		} catch (e) {
			if (!/(NO_ROOM_WITH_GIVEN_ID|ALREADY_FOLLOWER|ERR_NOT_ALLOWED|OWNER_CANT_CHANGE_ROLE)/.test(e.message)) {
				this.setState({
					error: {
						field: "place",
						message: ERROR_MESSAGES.UNKNOWN_ERROR
					}
				});
			}
		}
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
				message: ERROR_MESSAGES[validation.error] || ERROR_MESSAGES.UNKNOWN_ERROR
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

	componentWillReceiveProps() {
		this.setState({
			isLoading: false
		});
	}

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
						isDisabled={!!(this.state.error || !(this.state.nick && this.state.name))}
					/>
				);
			}
		}

		return <SignIn {...this.props} />;
	}
}
