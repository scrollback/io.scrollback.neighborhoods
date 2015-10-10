import React from "react-native";
import Chat from "../components/chat";
import controller from "./controller";

@controller
export default class ChatController extends React.Component {
	render() {
		return <Chat {...this.props} />;
	}
}
