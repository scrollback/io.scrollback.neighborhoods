import React from "react-native";
import ChatMessages from "../views/chat-messages";
import Container from "./controller";
import store from "../store/store";
import textUtils from "../lib/text-utils";

const {
	InteractionManager
} = React;

class ChatMessagesContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "missing" ]
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes.texts && changes.texts[this.props.room + "_" + this.props.thread] || changes.nav && changes.nav.textRange) {
				this._updateData();
			}
		});

		InteractionManager.runAfterInteractions(() => {
			this.emit("setstate", {
				nav: {
					room: this.props.room,
					thread: this.props.thread,
					mode: "chat"
				}
			});
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const time = store.get("nav", "textRange", "time");
				const before = store.get("nav", "textRange", "before");
				const after = store.get("nav", "textRange", "after");

				const beforeData = store.getTexts(this.props.room, this.props.thread, time, -before);
				const afterData = store.getTexts(this.props.room, this.props.thread, time, after);

				afterData.splice(-1, 1);

				const mergedData = beforeData.concat(afterData);
				const data = [];

				for (let i = mergedData.length - 1, l = 0; i >= l; i--) {
					const text = mergedData[i];

					if (typeof text === "string") {
						data.push(text);
					} else {
						const previousText = mergedData[i - 1];

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
			}
		});
	}

	_onEndReached() {
		this.emit("setstate", {
			nav: {
				textRange: {
					before: store.get("nav", "textRange", "before") + 20
				}
			}
		});
	}

	render() {
		return (
			<ChatMessages
				{...this.props}
				{...this.state}
				onEndReached={this._onEndReached.bind(this)}
			/>
		);
	}
}

ChatMessagesContainer.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired
};

export default Container(ChatMessagesContainer);
