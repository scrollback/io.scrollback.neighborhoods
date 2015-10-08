import React from "react-native";
import NotificationCenter from "../components/notification-center";
import store from "../../store/store";

const {
	InteractionManager
} = React;

export default class NotificationCenterController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "LOADING" ]
		};
	}

	componentDidMount() {
		this._mounted = true;

		setTimeout(() => this._onDataArrived(store.getNotes()), 0);
	}

	componentWillUnmount() {
		this._mounted = false;
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
					data: [ "FAILED" ]
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
