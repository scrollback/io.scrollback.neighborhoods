import React from "react-native";
import ChatMessagesController from "../controllers/chat-messages-controller";
import ChatInputController from "../controllers/chat-input-controller";

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
					room={this.props.room}
					thread={this.props.thread}
					style={styles.messages}
				/>
				<ChatInputController room={this.props.room} thread={this.props.thread} />
			</View>
		);
	}
}

Chat.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired
};
