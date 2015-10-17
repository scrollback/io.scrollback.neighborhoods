import React from "react-native";
import NotificationClearIcon from "../components/notification-clear-icon";
import controller from "./controller";

@controller
export default class NotificationClearIconController extends React.Component {
	_clearAll() {
		global.requestAnimationFrame(() => this.dispatch("note", { dismissTime: Date.now() }));
	}

	render() {
		return <NotificationClearIcon {...this.props} clearAll={this._clearAll.bind(this)} />;
	}
}
