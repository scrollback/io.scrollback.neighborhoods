import React from "react-native";
import StartDiscussion from "../components/start-discussion";
import controller from "./controller";
import routes from "../utils/routes";
import generate from "../../lib/generate.browser";

@controller
export default class StartDiscussionController extends React.Component {
	_postDiscussion(title, text) {
		const id = generate.uid();

		this.dispatch("text", {
			id,
			text,
			title,
			thread: id,
			to: this.props.room,
			from: this.props.user
		}).then(() => {
			this.props.navigator.replace(routes.chat({
				thread: id,
				room: this.props.room
			}));
		});
	}

	render() {
		return <StartDiscussion {...this.props} postDiscussion={this._postDiscussion.bind(this)} />;
	}
}

StartDiscussionController.propTypes = {
	room: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired,
	navigator: React.PropTypes.object.isRequired
};
