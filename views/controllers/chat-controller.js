import React from "react-native";
import Chat from "../components/chat";

export default class ChatController extends React.Component {
	render() {
		return <Chat {...this.props} />;
	}
}
