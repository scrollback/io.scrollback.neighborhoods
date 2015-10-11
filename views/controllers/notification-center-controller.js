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
			data: [ "loading" ]
		};
	}

	componentDidMount() {
		setTimeout(() => this._onDataArrived(this.store.getNotes()), 0);
	}

	_onDataArrived(newData) {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					data: newData
				});
			}
		});
	}

	_onError() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					data: [ "missing" ]
				});
			}
		});
	}

	_refreshData() {

	}

	render() {
		return (
			<NotificationCenter
				{...this.props}
				{...this.state}
				refreshData={this._refreshData.bind(this)}
			/>
		);
	}
}
