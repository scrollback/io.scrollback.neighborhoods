import React from "react-native";
import DiscussionItem from "../views/discussion-item";
import Container from "./container";
import store from "../store/store";
import actions from "../store/actions";

class DiscussionItemContainer extends React.Component {
	render() {
		return (
			<DiscussionItem
				{...this.props}
				hidden={store.isHidden(this.props.thread)}
				currentUser={store.get("user")}
				isCurrentUserAdmin={() => store.isUserAdmin(store.get("user"), this.props.thread.to)}
				isUserBanned={() => store.isUserBanned(this.props.thread.from, this.props.thread.to)}
				hideText={() => actions.hideText(this.props.thread)}
				unhideText={() => actions.unhideText(this.props.thread)}
				banUser={() => actions.banUser(this.props.thread)}
				unbanUser={() => actions.unbanUser(this.props.thread)}
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
