import React from "react-native";
import NotificationIcon from "../components/notification-icon";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class NotificationIconController extends React.Component {
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
				const count = this.store.getNotes().length;

				this.setState({ count });
			}
		});
	}

	render() {
		return <NotificationIcon {...this.props} {...this.state} />;
	}
}
