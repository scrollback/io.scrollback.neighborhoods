/* @flow */

import React from "react-native";
import StartDiscussion from "../views/StartDiscussion";
import Container from "./Container";
import Facebook from "../modules/Facebook";
import generate from "../lib/generate.browser";
import { convertRouteToURL } from "../routes/Route";
import config from "../store/config";

const {
	ToastAndroid
} = React;

const PERMISSION_PUBLISH_ACTIONS = "publish_actions";
const PERMISSION_PUBLISH_ERROR = "REQUEST_PERMISSION_ERROR";

class StartDiscussionContainer extends React.Component {
	static propTypes = {
		room: React.PropTypes.string.isRequired,
		user: React.PropTypes.string.isRequired
	};

	_getPublishPermissions = async () => {
		try {
			const result = await Facebook.logInWithPublishPermissions([ PERMISSION_PUBLISH_ACTIONS ]);

			if (result.permissions_granted.indexOf(PERMISSION_PUBLISH_ACTIONS) === -1) {
				throw new Error(PERMISSION_PUBLISH_ERROR);
			}

			return result;
		} catch (err) {
			ToastAndroid.show("Failed to get permission to post on Facebook", ToastAndroid.SHORT);
			throw err;
		}
	};

	_isFacebookPermissionGranted = async () => {
		try {
			const token = await Facebook.getCurrentAccessToken();

			return token.permissions_granted.indexOf(PERMISSION_PUBLISH_ACTIONS) > -1;
		} catch (err) {
			return false;
		}
	};

	_requestFacebookPermissions = async () => {
		let requested;

		try {
			const granted = await this._isFacebookPermissionGranted();

			if (!granted) {
				requested = true;
				await this._getPublishPermissions();
			}
		} catch (err) {
			if (requested) {
				throw err;
			} else {
				await this._getPublishPermissions();
			}
		}
	};

	_shareOnFacebook = async content => {
		try {
			const token = await Facebook.getCurrentAccessToken();

			if (token && token.user_id) {
				await Facebook.sendGraphRequest("POST", `/${token.user_id}/feed`, content);
			}

			ToastAndroid.show("Post shared on Facebook", ToastAndroid.SHORT);
		} catch (err) {
			ToastAndroid.show("Failed to share post on Facebook", ToastAndroid.SHORT);
		}
	};

	_postDiscussion = async ({ title, text, thread, picture }, shareOnFacebook) => {
		const id = thread || generate.uid();

		const post = await this.dispatch("text", {
			id,
			text: text.trim(),
			title: title.trim(),
			thread: id,
			to: this.props.room,
			from: this.props.user,
		});

		const content = {
			link: config.server.protocol + "//" + config.server.host + convertRouteToURL({
				name: "chat",
				props: {
					room: post.to,
					thread: post.id,
					title: post.title
				}
			}),
			picture
		};

		if (shareOnFacebook) {
			this._shareOnFacebook(content);
		}

		return post;
	};

	render() {
		return (
			<StartDiscussion
				{...this.props}
				postDiscussion={this._postDiscussion}
				requestFacebookPermissions={this._requestFacebookPermissions}
				isFacebookPermissionGranted={this._isFacebookPermissionGranted}
			/>
		);
	}
}

export default Container(StartDiscussionContainer);
