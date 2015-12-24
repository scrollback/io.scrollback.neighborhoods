import React from "react-native";
import ChatMessages from "../components/chat-messages";
import Controller from "./controller";
import textUtils from "../../lib/text-utils";

const {
	InteractionManager
} = React;

class ChatMessagesController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "missing" ]
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes.texts && changes.texts[this.props.room + "_" + this.props.thread]) {
				this._updateData();
			}
		});

		InteractionManager.runAfterInteractions(async () => {
			this.emit("setstate", {
				nav: {
					room: this.props.room,
					thread: this.props.thread,
					mode: "chat"
				}
			});

			const requested = this.store.get("nav", this.props.room + "_" + this.props.thread + "_requested");

			if (requested) {
				const texts = this.store.getTexts(this.props.room, this.props.thread, null, -requested);

				if (texts.length) {
					this._updateData();
				}
			} else {
				this._onEndReached();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const requested = this.store.get("nav", this.props.room + "_" + this.props.thread + "_requested");
				const texts = this.store.getTexts(this.props.room, this.props.thread, null, -requested);

				const data = [];

				for (let i = texts.length - 1, l = 0; i >= l; i--) {
					const text = texts[i];

					if (typeof text === "string") {
						data.push(text);
					} else {
						const previousText = texts[i - 1];

						data.push({
							text,
							textMetadata: textUtils.getMetadata(text.text),
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
		const key = this.props.room + "_" + this.props.thread + "_requested";
		const requested = this.store.get("nav", key);
		const texts = this.store.getTexts(this.props.room, this.props.thread, null, -requested);

		if (requested && requested > texts.length) {
			return;
		}

		this.emit("setstate", {
			nav: {
				[key]: (requested || 0) + 20
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

export default Controller(ChatMessagesController);
