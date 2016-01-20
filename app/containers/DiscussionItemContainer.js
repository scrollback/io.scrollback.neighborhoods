/* @flow */

import React from "react-native";
import DiscussionItem from "../views/DiscussionItem";
import Container from "./Container";
import store from "../store/store";
import actions from "../store/actions";

class DiscussionItemContainer extends React.Component {
	_isCurrentUserAdmin = () => {
		return store.isUserAdmin(store.get("user"), this.props.thread.to);
	};

	_isUserBanned = () => {
		return store.isUserBanned(this.props.thread.from, this.props.thread.to);
	};

	_hideText = () => {
		return actions.hideText(this.props.thread);
	};

	_unhideText = () => {
		return actions.unhideText(this.props.thread);
	};

	_banUser = () => {
		return actions.banUser(this.props.thread);
	};

	_unbanUser = () => {
		return actions.unbanUser(this.props.thread);
	};

	render() {
		return (
			<DiscussionItem
				{...this.props}
				hidden={store.isHidden(this.props.thread)}
				currentUser={store.get("user")}
				isCurrentUserAdmin={this._isCurrentUserAdmin}
				isUserBanned={this._isUserBanned}
				hideText={this._hideText}
				unhideText={this._unhideText}
				banUser={this._banUser}
				unbanUser={this._unbanUser}
			/>
		);
	}
}

DiscussionItemContainer.propTypes = {
	thread: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		from: React.PropTypes.string.isRequired,
		to: React.PropTypes.string.isRequired
	}).isRequired
};

export default Container(DiscussionItemContainer);
