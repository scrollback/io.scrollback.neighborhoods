import React from "react-native";
import SignIn from "../components/sign-in";
import controller from "./controller";

@controller
export default class SignInController extends React.Component {
	render() {
		return <SignIn {...this.props} {...this.state} />;
	}
}
