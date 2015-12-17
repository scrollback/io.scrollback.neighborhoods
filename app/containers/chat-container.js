import React from "react-native";
import Chat from "../views/chat";
import Container from "./container";
import store from "../store/store";

const {
	InteractionManager
} = React;

class ChatContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "missing"
		};
	}

	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				user: store.get("user")
			});
		});
	}

	_sendMessage(text, textId) {
		const textObj = {
			text: text.trim(),
			thread: this.props.thread,
			to: this.props.room,
			from: this.state.user
		};

		if (textId) {
			textObj.id = textId;
		}

		this.dispatch("text", textObj);
	}

	render() {
		return (
			<Chat
				sendMessage={this._sendMessage.bind(this)}
				{...this.props}
				{...this.state}
			/>
		);
	}
}

ChatContainer.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired
};

export default Container(ChatContainer);
