import React from "react-native";
import ModerationController from "./moderation-controller";
import ChatItem from "../components/chat-item";
import Controller from "./controller";

class ChatItemController extends React.Component {
	render() {
		return (
			<ModerationController text={this.props.text}>
				<ChatItem {...this.props} />
			</ModerationController>
		);
	}
}

ChatItemController.propTypes = {
	text: React.PropTypes.object.isRequired
};

export default Controller(ChatItemController);
