import React from "react-native";
import Avatar from "../components/avatar.js";
import config from "../../store/config";
import getAvatar from "../../lib/get-avatar";
import Controller from "./controller";

const {
	PixelRatio,
	InteractionManager
} = React;

class AvatarController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			uri: ""
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
				const { protocol, host } = config.server;
				const { nick, size } = this.props;

				const user = this.store.getUser(nick);

				let uri;

				if (user && user.picture) {
					uri = getAvatar(user.picture, (size * PixelRatio.get()));
				} else {
					uri = protocol + "//" + host + "/i/" + nick + "/picture?size=" + (size * PixelRatio.get());
				}

				this.setState({
					uri
				});
			}
		});
	}

	render() {

		return (
			<Avatar {...this.props} {...this.state} />
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

export default Controller(AvatarController);
