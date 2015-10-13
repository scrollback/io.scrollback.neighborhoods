import React from "react-native";
import ChatInput from "../components/chat-input";
import controller from "./controller";

@controller
export default class ChatInputController extends React.Component {
	_sendMessage(text) {
		this.dispatch("text", {
			text,
			thread: this.props.thread,
			to: this.props.room,
			from: this.props.user
		});
	}

	render() {
		return <ChatInput {...this.props} sendMessage={this._sendMessage.bind(this)} />;
	}
}

ChatInputController.propTypes = {
	thread: React.PropTypes.string.isRequired,
	room: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired
};
