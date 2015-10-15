import React from "react-native";
import Account from "../components/account";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class AccountController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "loading"
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			const user = this.store.get("user");

			if (changes.entities && changes.entities[user]) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					user: this.store.getUser()
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
