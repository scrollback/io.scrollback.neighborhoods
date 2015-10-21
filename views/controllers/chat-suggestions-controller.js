import React from "react-native";
import ChatSuggestions from "../components/chat-suggestions";
import controller from "./controller";

@controller
export default class ChatSuggestionsController {
	_getMatchingUsers(text) {
		let query;

		if (text) {
			query = text.slice(1);
		} else {
			return [];
		}

		const all = this.store.getTexts(this.props.room, this.props.thread, null, -30).map(t => t.from);

		return all.filter((u, i) => u && u.indexOf(query) === 0 && all.indexOf(u) === i && u !== this.props.user);
	}

	render() {
		return <ChatSuggestions {...this.props} data={this._getMatchingUsers(this.props.text)} />;
	}
}

ChatSuggestionsController.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired,
	text: React.PropTypes.string.isRequired
};
