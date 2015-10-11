import React from "react-native";
import SignIn from "../components/sign-in";
import controller from "./controller";

@controller
export default class SignInController extends React.Component {
	_signIn(provider, token) {
		this.dispatch("init", {
			auth: {
				[provider]: { token }
			}
		});
	}

	render() {
		return <SignIn {...this.props} signIn={this._signIn.bind(this)} />;
	}
}
