import React from "react-native";
import AvatarRound from "./avatar-round";

export default class UserIcon extends React.Component {
	render() {
		return <AvatarRound {...this.props} />;
	}
}
