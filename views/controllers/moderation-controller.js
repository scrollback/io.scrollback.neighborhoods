import React from "react-native";
import store from "../../store/store";
import Controller from "./controller";

class ModerationController extends React.Component {
	_isCurrentUserAdmin() {
		return store.isUserAdmin(store.get("user"), this.props.text.to);
	}

	_isTextHidden() {
		return store.isHidden(this.props.text);
	}

	_hideText() {
		const { text } = this.props;
		const tags = Array.isArray(text.tags) ? text.tags.slice(0) : [];

		tags.push("hidden");

		if (text.id === text.thread) {
			tags.push("thread-hidden");
		}

		return this.dispatch("edit", {
			to: text.to,
			ref: text.id,
			tags
		});
	}

	_unhideText() {
		const { text } = this.props;

		return this.dispatch("edit", {
			to: text.to,
			ref: text.id,
			tags: text.tags.filter(t => t !== "thread-hidden" && t !== "hidden")
		});
	}

	_isUserBanned() {
		const { text } = this.props;

		return store.isUserBanned(text.from, text.to);
	}

	_banUser() {
		const { text } = this.props;

		this.dispatch("expel", {
			to: text.to,
			ref: text.from,
			role: "banned"
		});
	}

	_unbanUser() {
		const { text } = this.props;

		this.dispatch("admit", {
			to: text.to,
			ref: text.from,
			role: "follower"
		});
	}

	render() {
		return React.cloneElement(this.props.children, {
			currentUser: store.get("user"),
			hidden: this._isTextHidden(),
			isCurrentUserAdmin: () => this._isCurrentUserAdmin(),
			isUserBanned: () => this._isUserBanned(),
			hideText: () => this._hideText(),
			unhideText: () => this._unhideText(),
			banUser: () => this._banUser(),
			unbanUser: () => this._unbanUser()
		});
	}
}

ModerationController.propTypes = {
	text: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		from: React.PropTypes.string.isRequired,
		to: React.PropTypes.string.isRequired
	}).isRequired,
	children: React.PropTypes.element.isRequired
};

export default Controller(ModerationController);
