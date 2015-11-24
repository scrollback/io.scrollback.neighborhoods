import React from "react-native";
import NotificationClearIcon from "../components/notification-clear-icon";
import Controller from "./controller";

class NotificationClearIconController extends React.Component {
	_clearAll() {
		this.dispatch("note", { dismissTime: Date.now() });
	}

	render() {
		return <NotificationClearIcon {...this.props} clearAll={this._clearAll.bind(this)} />;
	}
}

export default Controller(NotificationClearIconController);
