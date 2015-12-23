import React from "react-native";
import SignIn from "../views/sign-in";
import SignUp from "../views/sign-up";
import Container from "./container";
import userUtils from "../lib/user-utils";

class SignInContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null
		};
	}

	async _signIn(provider, token) {
		const init = await this.dispatch("init", {
			auth: {
				[provider]: { token }
			}
		});

		const user = init.user;

		if (userUtils.isGuest(user.id) && user.identities.some(ident => ident.indexOf("mailto:") === 0)) {
			if (this._mounted) {
				this.setState({
					user
				});
			}
		}
	}

	async _signUp(nick) {
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
			return await this.dispatch("user", {
				from: nick,
				to: nick,
				user: {
					id: nick,
					identities: user.identities,
					picture: user.params.pictures && user.params.pictures[0] || "",
					params: {
						pictures: user.params.pictures
					},
					guides: {}
				}
			});
		}
	}

	_cancelSignUp() {
		this.setState({
			user: null
		});
	}

	render() {
		if (this.state.user) {
			return (
				<SignUp
					user={this.state.user}
					signUp={this._signUp.bind(this)}
					cancelSignUp={this._cancelSignUp.bind(this)}
				/>
			);
		} else {
			return <SignIn {...this.props} signIn={this._signIn.bind(this)} />;
		}
	}
}

export default Container(SignInContainer);
