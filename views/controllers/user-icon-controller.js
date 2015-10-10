import React from "react-native";
import UserIcon from "../components/user-icon";
import controller from "./controller";

@controller
export default class UserIconController extends React.Component {
	render() {
		const user = this.store.getUser();

		return <UserIcon {...this.props} nick={user.id} />;
	}
}
