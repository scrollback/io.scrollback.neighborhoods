import React from "react-native";
import StartDiscussion from "../views/start-discussion";
import Container from "./container";
import SocialShare from "../modules/social-share";
import generate from "../lib/generate.browser";
import url from "../lib/url";

class StartDiscussionContainer extends React.Component {
	async _postDiscussion({ title, text, thread, image }, shareOnFacebook) {
		const id = thread || generate.uid();

		const post = await this.dispatch("text", {
			id,
			text: text.trim(),
			title: title.trim(),
			thread: id,
			to: this.props.room,
			from: this.props.user
		});

		const content = {
			title: title.trim(),
			link: url.get("thread", post)
		};

		if (image) {
			content.image = image;
		} else {
			content.description = text.trim();
		}

		if (shareOnFacebook) {
			SocialShare.shareOnFacebook(content);
		}

		return post;
	}

	render() {
		return <StartDiscussion {...this.props} postDiscussion={this._postDiscussion.bind(this)} />;
	}
}

StartDiscussionContainer.propTypes = {
	room: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired
};

export default Container(StartDiscussionContainer);
