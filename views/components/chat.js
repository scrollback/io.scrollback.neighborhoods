import React from "react-native";
import ChatMessagesController from "../controllers/chat-messages-controller";
import ChatInput from "./chat-input";

const {
	View,
	StyleSheet
} = React;

const styles = StyleSheet.create({
	messages: {
		flex: 1
	}
});

export default class Chat extends React.Component {
	render() {
		return (
			<View {...this.props}>
				<ChatMessagesController
					style={styles.messages}
					room={this.props.room}
					thread={this.props.thread}
					user={this.props.user}
					quoteMessage={this.props.quoteMessage}
					replyToMessage={this.props.replyToMessage}
				/>

				<ChatInput
					sendMessage={this.props.sendMessage}
					quoteMessage={this.props.quoteMessage}
					replyToMessage={this.props.replyToMessage}
					quotedText={this.props.quotedText}
					replyTo={this.props.replyTo}
				/>
			</View>
		);
	}
}

Chat.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired,
	sendMessage: React.PropTypes.func.isRequired,
	quoteMessage: React.PropTypes.func.isRequired,
	replyToMessage: React.PropTypes.func.isRequired,
	quotedText: React.PropTypes.string,
	replyTo: React.PropTypes.string
};
