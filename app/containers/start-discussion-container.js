import React from "react-native";
import StartDiscussion from "../views/start-discussion";
import Container from "./container";
import Facebook from "../modules/facebook";
import generate from "../lib/generate.browser";
import url from "../lib/url";

const PERMISSION_PUBLISH_ACTIONS = "publish_actions";

global.Facebook = Facebook;

class StartDiscussionContainer extends React.Component {
	async _getPublishPermissions() {
		const result = await Facebook.logInWithPublishPermissions([ PERMISSION_PUBLISH_ACTIONS ]);

		if (result.permissions_granted.indexOf(PERMISSION_PUBLISH_ACTIONS) === -1) {
			throw new Error("Failed to get permissions");
		}

		return result;
	}

	async _shareOnFacebook(content) {
		let token;

		try {
			token = await Facebook.getCurrentAccessToken();

			if (token.permissions_granted.indexOf(PERMISSION_PUBLISH_ACTIONS) === -1) {
				token = await this._getPublishPermissions();
			}
		} catch (err) {
			try {
				token = await this._getPublishPermissions();
			} catch (e) {
				return;
			}
		}

		if (token && token.user_id) {
			await Facebook.sendGraphRequest("POST", `/${token.user_id}/feed`, content);
		}
	}

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
			this._shareOnFacebook(content);
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
