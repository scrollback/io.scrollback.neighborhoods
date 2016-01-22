/* @flow */

import React from "react-native";
import NotificationBadge from "../views/NotificationBadge";
import Container from "./Container";
import store from "../store/store";

class NotificationBadgeContainer extends React.Component {
	static propTypes = {
		room: React.PropTypes.string,
		thread: React.PropTypes.string,
		grouped: React.PropTypes.bool
	};

	state = {
		count: 0
	};

	componentWillMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			if (changes && changes.notes) {
				this._updateData();
			}
		});
	}

	_updateData = () => {
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
	};

	render() {
		return <NotificationBadge {...this.props} {...this.state} />;
	}
}

export default Container(NotificationBadgeContainer);
