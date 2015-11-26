import React from "react-native";
import ModerationController from "./moderation-controller";
import DiscussionItem from "../components/discussion-item";
import Controller from "./controller";

class DiscussionItemController extends React.Component {
	render() {
		return (
			<ModerationController text={this.props.thread}>
				<DiscussionItem {...this.props} />
			</ModerationController>
		);
	}
}

DiscussionItemController.propTypes = {
	thread: React.PropTypes.object.isRequired
};

export default Controller(DiscussionItemController);
