/* @flow */

import React from "react-native";
import ChatItem from "../views/ChatItem";
import Container from "./Container";
import store from "../store/store";
import actions from "../store/actions";

class ChatItemContainer extends React.Component {
	static propTypes = {
		text: React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			from: React.PropTypes.string.isRequired,
			to: React.PropTypes.string.isRequired
		}).isRequired
	};

	_isUserAdmin = () => {
		return store.isUserAdmin(store.get("user"), this.props.text.to);
	};

	_isUserBanned = () => {
		return store.isUserBanned(this.props.text.from, this.props.text.to);
	};

	_hideText = () => {
		return actions.hideText(this.props.text);
	};

	_unhideText = () => {
		return actions.unhideText(this.props.text);
	};

	_banUser = () => {
		return actions.banUser(this.props.text);
	};

	_unbanUser = () => {
		return actions.unbanUser(this.props.text);
	};

	render() {
		return (
			<ChatItem
				{...this.props}
				hidden={store.isHidden(this.props.text)}
				isCurrentUserAdmin={this._isUserAdmin}
				isUserBanned={this._isUserBanned}
				hideText={this._hideText}
				unhideText={this._unhideText}
				banUser={this._banUser}
				unbanUser={this._unbanUser}
			/>
		);
	}
}

export default Container(ChatItemContainer);
