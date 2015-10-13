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
			user: "loading",
			quotedText: "",
			replyTo: ""
		};
	}

	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				user: this.store.get("user"),
				quotedText: "",
				replyTo: ""
			});
		});
	}

	_quoteMessage(text) {
		this.setState({
			quotedText: text.text,
			replyTo: text.from
		});
	}

	_replyToMessage(text) {
		this.setState({
			replyTo: text.from,
			quotedText: ""
		});
	}

	_sendMessage(text) {
		this.dispatch("text", {
			text,
			thread: this.props.thread,
			to: this.props.room,
			from: this.state.user
		});


		this.setState({
			replyTo: "",
			quotedText: ""
		});
	}

	render() {
		return (
			<Chat
				quoteMessage={this._quoteMessage.bind(this)}
				replyToMessage={this._replyToMessage.bind(this)}
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
