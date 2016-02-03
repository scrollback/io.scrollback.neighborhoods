import React from "react-native";
import AppbarTouchable from "./AppbarTouchable";
import AppbarIcon from "./AppbarIcon";
import Share from "../modules/Share";
import { convertRouteToURL } from "../routes/Route";
import config from "../store/config";

export default class ShareButton extends React.Component {
	_handlePress = () => {
		const { thread } = this.props;

		if (thread) {
			Share.shareItem("Share discussion", config.server.protocol + "//" + config.server.host + convertRouteToURL({
				name: "chat",
				props: {
					room: thread.to,
					thread: thread.id,
					title: thread.title
				}
			}));
		}
	};

	render() {
		return (
			<AppbarTouchable onPress={this._handlePress}>
				<AppbarIcon name="share" />
			</AppbarTouchable>
		);
	}
}

ShareButton.propTypes = {
	thread: React.PropTypes.shape({
		to: React.PropTypes.string,
		id: React.PropTypes.string,
		title: React.PropTypes.string
	})
};
