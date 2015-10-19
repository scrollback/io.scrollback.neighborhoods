import React from "react-native";
import NotificationCenter from "../components/notification-center";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class NotificationCenterController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "missing" ]
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes && changes.notes) {
				this._updateData();
			}
		});
	}

	_dismissNote(note) {
		this.dispatch("note", {
			ref: note.ref,
			noteType: note.noteType,
			dismissTime: Date.now()
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					data: this.store.getNotes()
				});
			}
		});
	}

	render() {
		return (
			<NotificationCenter
				{...this.props}
				{...this.state}
				dismissNote={this._dismissNote.bind(this)}
			/>
		);
	}
}
