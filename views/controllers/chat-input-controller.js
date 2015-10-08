import React from "react-native";
import ChatInput from "../components/chat-input";

export default class ChatInputController extends React.Component {
    render() {
        return <ChatInput {...this.props} />;
    }
}
