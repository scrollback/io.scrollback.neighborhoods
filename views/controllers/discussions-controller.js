import React from "react-native";
import Discussions from "../components/discussions";
import Controller from "./controller";
import store from "../../store/store";

const {
	InteractionManager
} = React;

class DiscussionsController extends React.Component {
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
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const time = store.get("nav", "threadRange", "time");
				const before = store.get("nav", "threadRange", "before");
				const after = store.get("nav", "threadRange", "after");

				const beforeData = store.getThreads(this.props.room, time, -before);
				const afterData = store.getThreads(this.props.room, time, after);

				afterData.splice(-1, 1);

				this.setState({
					data: beforeData.concat(afterData).reverse(),
					user: store.get("user")
				});
			}
		});
	}

	_onEndReached() {
		this.emit("setstate", {
			nav: {
				threadRange: {
					before: store.get("nav", "threadRange", "before") + 20
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

export default Controller(DiscussionsController);
