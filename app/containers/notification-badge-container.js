import React from "react-native";
import NotificationBadge from "../views/notification-badge";
import Container from "./container";
import store from "../store/store";

const {
	InteractionManager
} = React;

class NotificationBadgeContainer extends React.Component {
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
				const notes = store.getNotes();
				const { room, thread, grouped } = this.props;

				let items;

				if (room) {
					items = notes.filter(note => note.group.split("/")[0] === room);
				} else if (thread) {
					items = notes.filter(note => note.group.split("/")[1] === thread);
				} else {
					items = notes;
				}

				let count;

				if (grouped) {
					count = items.length;
				} else {
					count = 0;

					for (let i = 0, l = items.length; i < l; i++) {
						const n = items[i];

						if (n.count) {
							count += n.count;
						} else {
							count++;
						}
					}
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

NotificationBadgeContainer.propTypes = {
	room: React.PropTypes.string,
	thread: React.PropTypes.string,
	grouped: React.PropTypes.bool
};

export default Container(NotificationBadgeContainer);
