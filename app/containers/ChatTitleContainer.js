import React from "react-native";
import ChatTitle from "../views/ChatTitle";
import Container from "./Container";
import store from "../store/store";

class ChatTitleContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			thread: "missing"
		};
	}

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			if (changes.indexes && changes.indexes.threadsById && changes.indexes.threadsById[this.props.thread]) {
				this._updateData();
			}
		});
	}

	_updateData = () => {
		this.setState({
			thread: store.getThreadById(this.props.thread) || "missing"
		});
	};

	render() {
		return <ChatTitle {...this.props} {...this.state} />;
	}
}

ChatTitleContainer.propTypes = {
	thread: React.PropTypes.string.isRequired
};

export default Container(ChatTitleContainer);
