/* @flow */

import React from "react-native";
import SignUp from "../views/Onboard/SignUp";
import Container from "./Container";
import store from "../store/store";

class SignUpContainer extends React.Component {
	state = {
		user: null
	};

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

	_checkNickName = async nick => {
		const results = await this.query("getEntities", { ref: nick });

		return results && results.length;
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

		if (!user) {
			throw new Error("USER_NOT_INITED");
		}

		await this.dispatch("user", {
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
	};

	_cancelSignUp = () => {
		this.setState({
			user: null
		});
	};

	_saveParams = (params: Object) => {
		if (!this.state.user) {
			throw new Error("USER_NOT_INITED");
		}

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
