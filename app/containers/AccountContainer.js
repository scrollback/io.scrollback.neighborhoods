import React from "react-native";
import Account from "../views/Account";
import Container from "./Container";
import store from "../store/store";

const {
	InteractionManager
} = React;

class AccountContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "missing"
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			const user = store.get("user");

			if (changes.entities && changes.entities[user]) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					user: store.getUser()
				});
			}
		});
	}

	_saveUser(user) {
		this.dispatch("user", {
			to: user.id,
			user
		});

		this.setState({ user });
	}

	_signOut() {
		this.emit("logout");
	}

	render() {
		return (
			<Account
				{...this.props}
				{...this.state}
				saveUser={this._saveUser.bind(this)}
				signOut={this._signOut.bind(this)}
			/>
		);
	}
}

export default Container(AccountContainer);
