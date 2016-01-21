/* @flow */

import React from "react-native";
import SignUp from "../views/Onboard/SignUp";
import Container from "./Container";
import store from "../store/store";

class SignUpContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null
		};
	}

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			if (changes.user) {
				this._updateData();
			} else {
				const user = store.get("user");

				if (changes.entities && changes.entities[user]) {
					this._updateData();
				}
			}
		});
	}

	_updateData = () => {
		this.setState({
			user: store.getUser()
		});
	};

	_signIn = ({ provider, token }) => {
		return this.dispatch("init", {
			auth: {
				[provider]: { token }
			}
		});
	};

	_signUp = async ({ nick, name }) => {
		const { user } = this.state;

		let results;

		try {
			results = await this.query("getEntities", { ref: nick });
		} catch (e) {
			throw new Error("An error occured!");
		}

		if (results && results.length) {
			throw new Error(nick + " is already taken.");
		} else {
			return this.dispatch("user", {
				from: nick,
				to: nick,
				user: {
					id: nick,
					identities: [ user.identities[user.identities.length - 1] ],
					picture: user.params.pictures && user.params.pictures[0] || "",
					params: {
						pictures: user.params.pictures
					},
					guides: {
						fullname: name
					}
				}
			});
		}
	};

	_cancelSignUp = () => {
		this.setState({
			user: null
		});
	};

	_saveParams = (params: Object) => {
		const user = {
			...this.state.user,
			params: {
				...this.state.user.params,
				...params
			}
		};

		return this.dispatch("user", {
			from: user.id,
			to: user.id,
			user
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
			/>
		);
	}
}

export default Container(SignUpContainer);
