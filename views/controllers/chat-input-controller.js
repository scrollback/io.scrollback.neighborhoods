import React from "react-native";
import ChatInput from "../components/chat-input";
import controller from "./controller";

@controller
export default class ChatInputController extends React.Component {
	render() {
		return <ChatInput {...this.props} />;
	}
}
