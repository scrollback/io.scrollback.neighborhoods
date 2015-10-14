import React from "react-native";
import ChatMessages from "../components/chat-messages";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class ChatMessagesController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "loading" ]
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
				const time = this.store.get("nav", "textRange", "time");
				const before = this.store.get("nav", "textRange", "before");
				const after = this.store.get("nav", "textRange", "after");

				const beforeData = this.store.getTexts(this.props.room, this.props.thread, time, -before);
				const afterData = this.store.getTexts(this.props.room, this.props.thread, time, after);

				afterData.splice(-1, 1);

				const mergedData = beforeData.concat(afterData);
				const data = [];

				for (let i = mergedData.length - 1, l = 0; i >= l; i--) {
					const text = mergedData[i];

					if (typeof text === "string") {
						data.push(text);
					} else {
						data.push({
							text,
							previousText: mergedData[i - 1]
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
					before: this.store.get("nav", "textRange", "before") + 20
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

ChatMessagesController.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired
};
