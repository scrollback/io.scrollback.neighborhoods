import React from "react-native";
import Avatar from "../components/avatar.js";
import controller from "./controller";
import config from "../../store/config";
import getAvatar from "../../lib/get-avatar";

@controller
export default class AvatarController extends React.Component {
	_getAvatarUri() {
		const { protocol, host } = config.server;
		const { nick, size } = this.props;

		const user = this.store.getUser(nick);

		if (user && user.picture) {
			return getAvatar(user.picture, size);
		} else {
			return protocol + "//" + host + "/i/" + nick + "/picture?size=" + size;
		}
	}

	render() {

		return (
			<Avatar
				{...this.props}
				uri={this._getAvatarUri()}
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
