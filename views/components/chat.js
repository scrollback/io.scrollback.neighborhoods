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
				<ChatMessagesController style={styles.messages} />
				<ChatInputController />
			</View>
		);
	}
}
