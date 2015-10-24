import React from "react-native";
import ChatSuggestions from "../components/chat-suggestions";
import controller from "./controller";

@controller
export default class ChatSuggestionsController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: this._getMatchingUsers(this.props.text)
		};

		this._cachedResults = {};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: this._getMatchingUsers(nextProps.text)
		});
	}

	async _fetchUsers(query) {
		const res = await this.query("getUsers", {
			ref: query + "*",
			limit: 5
		});

		// Check if the query is still the same
		if (query !== this.props.text.slice(1)) {
			return;
		}

		const results = res.results;
		const data = this.state.data.slice(0);

		for (let i = 0, l = results.length; i < l; i++) {
			const user = results[i];

			if (user && user.id) {
				if (data.indexOf(user.id) === -1) {
					data.push(user.id);
				}
			}
		}

		this._cachedResults[query] = data;

		this.setState({
			data
		});
	}

	_getMatchingUsers(text) {
		let query;

		if (text) {
			query = text.slice(1);
		} else {
			return [];
		}

		let all = [];

		if (query) {
			if (this._cachedResults[query]) {
				all = this._cachedResults[query];
			} else {
				this._fetchUsers(query);
			}
		}

		const related = this.store.getTexts(this.props.room, this.props.thread, null, -30).map(t => t.from);

		for (let i = 0, l = related.length; i < l; i++) {
			if (all.indexOf(related[i]) === -1) {
				all.push(related[i]);
			}
		}

		return all.filter((u, i) => u && u.indexOf(query) === 0 && all.indexOf(u) === i && u !== this.props.user).reverse();
	}

	render() {
		return <ChatSuggestions {...this.props} {...this.state} />;
	}
}

ChatSuggestionsController.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired,
	text: React.PropTypes.string.isRequired
};
