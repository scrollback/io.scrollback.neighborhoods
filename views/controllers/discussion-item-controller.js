import React from "react-native";
import DiscussionItem from "../components/discussion-item";
import store from "../../store/store";
import Controller from "./controller";

class DiscussionItemController extends React.Component {
	_isCurrentUserAdmin() {
		return store.isUserAdmin(store.get("user"), this.props.thread.to);
	}

	_isThreadHidden() {
		return store.isHidden(this.props.thread);
	}

	_hideThread() {
		const { thread } = this.props;
		const tags = Array.isArray(thread.tags) ? thread.tags.slice(0) : [];

		tags.push("thread-hidden");

		return this.dispatch("edit", {
			to: thread.to,
			ref: thread.id,
			tags
		});
	}

	_unhideThread() {
		const { thread } = this.props;

		return this.dispatch("edit", {
			to: thread.to,
			ref: thread.id,
			tags: thread.tags.filter(t => t !== "thread-hidden")
		});
	}

	_isUserBanned() {
		const { thread } = this.props;

		return store.isUserBanned(thread.from, thread.to);
	}

	_banUser() {
		const { thread } = this.props;

		this.dispatch("expel", {
			to: thread.to,
			ref: thread.from,
			role: "banned"
		});
	}

	_unbanUser() {
		const { thread } = this.props;

		this.dispatch("admit", {
			to: thread.to,
			ref: thread.from,
			role: "follower"
		});
	}

	render() {
		return (
			<DiscussionItem
				{...this.props}
				isCurrentUserAdmin={this._isCurrentUserAdmin.bind(this)}
				isThreadHidden={this._isThreadHidden.bind(this)}
				isUserBanned={this._isUserBanned.bind(this)}
				hideThread={this._hideThread.bind(this)}
				unhideThread={this._unhideThread.bind(this)}
				banUser={this._banUser.bind(this)}
				unbanUser={this._unbanUser.bind(this)}
			/>
		);
	}
}

DiscussionItemController.propTypes = {
	thread: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		from: React.PropTypes.string.isRequired,
		to: React.PropTypes.string.isRequired
	}).isRequired
};

export default Controller(DiscussionItemController);
