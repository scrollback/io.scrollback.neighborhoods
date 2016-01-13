import React from "react-native";
import NotificationCenter from "../views/NotificationCenter";
import Container from "./Container";
import store from "../store/store";

class NotificationCenterContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "missing" ]
		};
	}

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			if (changes && changes.notes) {
				this._updateData();
			}
		});
	}

	_dismissNote = note => {
		this.dispatch("note", {
			ref: note.ref,
			noteType: note.noteType,
			dismissTime: Date.now()
		});
	};

	_updateData = () => {
		this.setState({
			data: store.getNotes()
		});
	};

	render() {
		return (
			<NotificationCenter
				{...this.props}
				{...this.state}
				dismissNote={this._dismissNote}
			/>
		);
	}
}

export default Container(NotificationCenterContainer);
