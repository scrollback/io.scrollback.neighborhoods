import React from "react-native";
import StartDiscussion from "../views/StartDiscussion";
import Container from "./Container";
import Facebook from "../modules/Facebook";
import generate from "../lib/generate.browser";
import url from "../lib/url";

const PERMISSION_PUBLISH_ACTIONS = "publish_actions";
const PERMISSION_PUBLISH_ERROR = "REQUEST_PERMISSION_ERROR";

global.Facebook = Facebook;

class StartDiscussionContainer extends React.Component {
	async _getPublishPermissions() {
		const result = await Facebook.logInWithPublishPermissions([ PERMISSION_PUBLISH_ACTIONS ]);

		if (result.permissions_granted.indexOf(PERMISSION_PUBLISH_ACTIONS) === -1) {
			throw new Error(PERMISSION_PUBLISH_ERROR);
		}

		return result;
	}

	async _requestFacebookPermissions() {
		try {
			const token = await Facebook.getCurrentAccessToken();

			if (token.permissions_granted.indexOf(PERMISSION_PUBLISH_ACTIONS) === -1) {
				await this._getPublishPermissions();
			}
		} catch (err) {
			if (err.message === PERMISSION_PUBLISH_ERROR) {
				throw err;
			} else {
				await this._getPublishPermissions();
			}
		}
	}

	async _shareOnFacebook(content) {
		const token = await Facebook.getCurrentAccessToken();

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
			message: "I started a discussion on HeyNeighbor",
			link: url.get("thread", post)
		};

		if (image) {
			content.image = image;
		}

		if (shareOnFacebook) {
			this._shareOnFacebook(content);
		}

		return post;
	}

	render() {
		return (
			<StartDiscussion
				{...this.props}
				postDiscussion={this._postDiscussion.bind(this)}
				requestFacebookPermissions={this._requestFacebookPermissions.bind(this)}
			/>
		);
	}
}

StartDiscussionContainer.propTypes = {
	room: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired
};

export default Container(StartDiscussionContainer);
