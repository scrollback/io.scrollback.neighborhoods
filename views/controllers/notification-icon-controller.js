import React from "react-native";
import NotificationIcon from "../components/notification-icon";
import controller from "./controller";

@controller
export default class NotificationIconController extends React.Component {
	constructor(props) {
		super(props);

		this.state = { count: 0 };
	}

	componentWillMount() {
		this.setState({
			count: this.store.getNotes().length
		});
	}

	render() {
		return <NotificationIcon {...this.props} {...this.state} />;
	}
}
