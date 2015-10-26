import React from "react-native";
import Discussions from "../components/discussions";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class DiscussionsController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "missing" ],
			user: ""
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes.threads && changes.threads[this.props.room] || changes.nav && changes.nav.threadRange) {
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

			// Auto join room
			try {
				await this.dispatch("join", {
					to: this.props.room
				});
			} catch (err) {
				// Do nothing
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const time = this.store.get("nav", "threadRange", "time");
				const before = this.store.get("nav", "threadRange", "before");
				const after = this.store.get("nav", "threadRange", "after");

				const beforeData = this.store.getThreads(this.props.room, time, -before);
				const afterData = this.store.getThreads(this.props.room, time, after);

				afterData.splice(-1, 1);

				this.setState({
					data: beforeData.concat(afterData).reverse(),
					user: this.store.get("user")
				});
			}
		});
	}

	_onEndReached() {
		this.emit("setstate", {
			nav: {
				threadRange: {
					before: this.store.get("nav", "threadRange", "before") + 20
				}
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

DiscussionsController.propTypes = {
	room: React.PropTypes.string.isRequired
};
