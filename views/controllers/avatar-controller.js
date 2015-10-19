import React from "react-native";
import Avatar from "../components/avatar.js";
import controller from "./controller";
import config from "../../store/config";

@controller
export default class AvatarController extends React.Component {
	render() {
		const { protocol, host } = config.server;
		const { nick, size } = this.props;

		return (
			<Avatar
				{...this.props}
				uri={nick ? protocol + "//" + host + "/i/" + nick + "/picture?size=" + size : ""}
			/>
		);
	}
}

AvatarController.propTypes = {
	nick: React.PropTypes.string.isRequired,
	size: React.PropTypes.number
};

AvatarController.defaultProps = {
	size: 48
};
