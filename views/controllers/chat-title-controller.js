import React from "react-native";
import ChatTitle from "../components/chat-title";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class ChatTitleController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			thread: "loading"
		};
	}

	componentDidMount() {
		setTimeout(() => this._onDataArrived(this.store.getThreadById(this.props.thread)), 0);
	}

	_onDataArrived(thread) {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({ thread });
			}
		});
	}

	_onError() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					thread: "missing"
				});
			}
		});
	}

	render() {
		return <ChatTitle {...this.props} {...this.state} />;
	}
}

ChatTitleController.propTypes = {
	thread: React.PropTypes.string.isRequired
};
