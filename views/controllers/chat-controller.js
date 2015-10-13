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

	render() {
		return <Chat {...this.props} {...this.state} />;
	}
}
