import React from "react-native";
import SignIn from "../components/sign-in";
import SignUp from "../components/sign-up";
import controller from "./controller";
import userUtils from "../../lib/user-utils";

@controller
export default class SignInController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: null
		};
	}

	_signIn(provider, token) {
		this.dispatch("init", {
			auth: {
				[provider]: { token }
			}
		}).then(init => {
			const user = init.user;

			if (userUtils.isGuest(user.id) && user.identities.some(ident => ident.indexOf("mailto:") === 0)) {
				if (this._mounted) {
					this.setState({
						user
					});
				}
			}
		});
	}

	_signUp(nick) {
		const { user } = this.state;

		return this.query("getEntities", { ref: nick })
			.catch(() => {
				throw new Error("An error occured!");
			})
			.then(res => {
				if (res && res.results && res.results.length) {
					throw new Error(nick + " is already taken.");
				} else {
					return this.dispatch("user", {
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
			});
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
