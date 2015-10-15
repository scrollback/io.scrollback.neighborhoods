import React from "react-native";
import Chat from "../components/chat";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class ChatController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "loading"
		};
	}

	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				user: this.store.get("user")
			});
		});
	}

	_sendMessage(text) {
		this.dispatch("text", {
			text,
			thread: this.props.thread,
			to: this.props.room,
			from: this.state.user
		});
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

ChatController.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired
};
