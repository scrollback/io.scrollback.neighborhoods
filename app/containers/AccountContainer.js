/* @flow */

import React from "react-native";
import Account from "../views/Account";
import Container from "./Container";
import store from "../store/store";

class AccountContainer extends React.Component {
	state = {
		user: "missing"
	};

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			const user = store.get("user");

			if (changes.entities && changes.entities[user]) {
				this._updateData();
			}
		});
	}

	_updateData = () => {
		this.setState({
			user: store.getUser()
		});
	};

	_saveUser = user => {
		this.dispatch("user", {
			to: user.id,
			user
		});

		this.setState({ user });
	};

	_signOut = () => {
		this.emit("logout");
	};

	render() {
		return (
			<Account
				{...this.props}
				{...this.state}
				saveUser={this._saveUser}
				signOut={this._signOut}
			/>
		);
	}
}

export default Container(AccountContainer);
