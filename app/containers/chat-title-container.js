import React from "react-native";
import ChatTitle from "../views/chat-title";
import Container from "./container";
import store from "../store/store";

const {
	InteractionManager
} = React;

class ChatTitleContainer extends React.Component {
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
					thread: store.getThreadById(this.props.thread) || "missing"
				});
			}
		});
	}

	render() {
		return <ChatTitle {...this.props} {...this.state} />;
	}
}

ChatTitleContainer.propTypes = {
	thread: React.PropTypes.string.isRequired
};

export default Container(ChatTitleContainer);
