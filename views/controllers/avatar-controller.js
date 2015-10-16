import React from "react-native";
import Avatar from "../components/avatar.js";
import controller from "./controller";
import config from "../../store/config";
import getAvatar from "../../lib/get-avatar";

const {
	InteractionManager
} = React;

@controller
export default class AvatarController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			uri: null
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
				const user = this.store.getUser(this.props.nick);

				if (user && user.picture) {

					this.setState({
						uri: getAvatar(user.picture, this.props.size)
					});
				} else {
					this.query("getUsers", { ref: this.props.nick })
						.then(res => {
							const u = res.results[0];

							if (u) {
								this.setState({
									uri: getAvatar(u.picture, this.props.size)
								});
							} else {
								throw new Error("Failed to get user");
							}
						})
						.catch(() => this.setState({
							uri: config.protocol + "//" + config.host + "/public/s/assets/avatar-fallback.png"
						}));
				}
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
