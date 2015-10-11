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
			data: [ "loading" ]
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes.threads && changes.threads[this.props.room]) {
				this._updateData();
			}
		});

		this.emit("setstate", {
			nav: {
				room: this.props.room,
				mode: "room"
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					data: this.store.getThreads(this.props.room, null, -10)
				});
			}
		});
	}

	render() {
		return (
			<Discussions
				{...this.props}
				{...this.state}
			/>
		);
	}
}

DiscussionsController.propTypes = {
	room: React.PropTypes.string.isRequired
};
