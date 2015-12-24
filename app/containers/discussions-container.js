import React from "react-native";
import Discussions from "../views/discussions";
import Container from "./container";
import store from "../store/store";

const {
	InteractionManager
} = React;

class DiscussionsContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "missing" ],
			user: ""
		};
	}

	componentDidMount() {
		this.handle("statechange", changes => {
			if (changes.threads && changes.threads[this.props.room]) {
				this._updateData();
			}
		});

		InteractionManager.runAfterInteractions(async () => {
			this.emit("setstate", {
				nav: {
					room: this.props.room,
					mode: "room"
				}
			});

			const requested = store.get("nav", this.props.room + "_requested");

			if (requested) {
				const threads = store.getThreads(this.props.room, null, -requested);

				if (threads.length) {
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
				const requested = store.get("nav", this.props.room + "_requested");
				const threads = store.getThreads(this.props.room, null, -requested);

				this.setState({
					data: threads.reverse(),
					user: store.get("user")
				});
			}
		});
	}

	_onEndReached() {
		const key = this.props.room + "_requested";
		const requested = store.get("nav", key);
		const threads = store.getThreads(this.props.room, null, -requested);

		if (requested && requested > threads.length) {
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
			<Discussions
				{...this.props}
				{...this.state}
				onEndReached={this._onEndReached.bind(this)}
			/>
		);
	}
}

DiscussionsContainer.propTypes = {
	room: React.PropTypes.string.isRequired
};

export default Container(DiscussionsContainer);
