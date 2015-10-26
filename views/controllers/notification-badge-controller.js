import React from "react-native";
import NotificationBadge from "../components/notification-badge";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class NotificationBadgeController extends React.Component {
	constructor(props) {
		super(props);

		this.state = { count: 0 };
	}

	componentWillMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes && changes.notes) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const notes = this.store.getNotes();

				let count;

				if (this.props.room) {
					count = notes.filter(note => note.group.split("/")[0] === this.props.room).length;
				} else if (this.props.thread) {
					count = notes.filter(note => note.group.split("/")[1] === this.props.thread).length;
				} else {
					count = notes.length;
				}

				this.setState({
					count
				});
			}
		});
	}

	render() {
		return <NotificationBadge {...this.props} {...this.state} />;
	}
}

NotificationBadgeController.propTypes = {
	room: React.PropTypes.string,
	thread: React.PropTypes.string
};
