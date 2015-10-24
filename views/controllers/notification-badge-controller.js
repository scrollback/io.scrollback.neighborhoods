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
				this.setState({
					count: this.store.getNotes().length
				});
			}
		});
	}

	render() {
		return <NotificationBadge {...this.props} {...this.state} />;
	}
}
