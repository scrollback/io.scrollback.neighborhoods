import React from "react-native";
import ChatItem from "../views/chat-item";
import Controller from "./controller";
import store from "../../store/store";
import actions from "../../store/actions";

class ChatItemController extends React.Component {
	render() {
		return (
			<ChatItem
				{...this.props}
				hidden={store.isHidden(this.props.text)}
				isCurrentUserAdmin={() => store.isUserAdmin(store.get("user"), this.props.text.to)}
				isUserBanned={() => store.isUserBanned(this.props.text.from, this.props.text.to)}
				hideText={() => actions.hideText(this.props.text)}
				unhideText={() => actions.unhideText(this.props.text)}
				banUser={() => actions.banUser(this.props.text)}
				unbanUser={() => actions.unbanUser(this.props.text)}
			/>
		);
	}
}

ChatItemController.propTypes = {
	text: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		from: React.PropTypes.string.isRequired,
		to: React.PropTypes.string.isRequired
	}).isRequired
};

export default Controller(ChatItemController);
