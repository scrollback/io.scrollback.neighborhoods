import React from "react-native";
import Avatar from "../components/avatar.js";
import Controller from "./controller";
import store from "../../store/store";
import config from "../../store/config";
import getAvatar from "../../lib/get-avatar";

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
			if (changes.entities && changes.entities[this.props.nick]) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const { protocol, host } = config.server;
				const { nick, size } = this.props;

				const user = store.getUser(nick);

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
