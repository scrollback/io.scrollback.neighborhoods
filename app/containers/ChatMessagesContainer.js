/* @flow */

import React from "react-native";
import ChatMessages from "../views/ChatMessages";
import Container from "./Container";
import store from "../store/store";
import textUtils from "../lib/text-utils";

class ChatMessagesContainer extends React.Component {
	static propTypes = {
		room: React.PropTypes.string.isRequired,
		thread: React.PropTypes.string.isRequired
	};

	state = {
		data: [ "missing" ]
	};

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			if (changes.texts && changes.texts[this.props.room + "_" + this.props.thread]) {
				this._updateData();
			}
		});

		this.runAfterInteractions(async () => {
			this.emit("setstate", {
				nav: {
					room: this.props.room,
					thread: this.props.thread,
					mode: "chat"
				}
			});

			const requested = store.get("nav", this.props.room + "_" + this.props.thread + "_requested");

			if (requested) {
				const texts = store.getTexts(this.props.room, this.props.thread, null, -requested);

				if (texts.length) {
					this._updateData();
				}
			} else {
				this._handleEndReached();
			}
		});
	}

	_updateData = () => {
		const requested = store.get("nav", this.props.room + "_" + this.props.thread + "_requested");
		const texts = store.getTexts(this.props.room, this.props.thread, null, -requested);

		const data = [];

		for (let i = texts.length - 1, l = 0; i >= l; i--) {
			const text = texts[i];

			if (typeof text === "string") {
				data.push(text);
			} else {
				const previousText = texts[i - 1];

				data.push({
					text,
					metadata: textUtils.getMetadata(text.text),
					previousText: typeof previousText === "object" ? previousText : null
				});
			}
		}

		this.setState({
			data
		});
	};

	_handleEndReached = () => {
		const key = this.props.room + "_" + this.props.thread + "_requested";
		const requested = store.get("nav", key);
		const texts = store.getTexts(this.props.room, this.props.thread, null, -requested);

		if (requested && requested > (texts.length + 1)) {
			return;
		}

		this.emit("setstate", {
			nav: {
				[key]: (requested || 0) + 20
			}
		});
	};

	render() {
		return (
			<ChatMessages
				{...this.props}
				{...this.state}
				onEndReached={this._handleEndReached}
			/>
		);
	}
}

export default Container(ChatMessagesContainer);
