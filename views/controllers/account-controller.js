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
		setTimeout(() => this._onDataArrived(this.store.getUser()), 100);

		this.emit("setstate", {
			nav: { mode: "home" }
		});
	}

	_onDataArrived(user) {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({ user });
			}
		});
	}

	_onError() {
		this.setState({
			user: "missing"
		});
	}

	_saveUser(user) {
		this.dispatch("user", {
			to: user.id,
			user
		});

		this.setState({ user });
	}

	render() {
		return (
			<Account
				{...this.props}
				{...this.state}
				saveUser={this._saveUser.bind(this)}
			/>
		);
	}
}
