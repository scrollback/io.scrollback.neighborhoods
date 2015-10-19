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
			thread: "missing"
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes.indexes && changes.indexes.threadsById && changes.indexes.threadsById[this.props.thread]) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					thread: this.store.getThreadById(this.props.thread) || "missing"
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
