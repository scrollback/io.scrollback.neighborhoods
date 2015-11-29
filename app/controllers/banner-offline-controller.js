import React from "react-native";
import BannerOffline from "../views/banner-offline";
import Controller from "./controller";
import store from "../../store/store";

const {
	InteractionManager
} = React;

class BannerOfflineController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			connectionStatus: null
		};
	}

	componentWillMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes.app && changes.app.connectionStatus) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			this.setState({
				connectionStatus: store.get("app", "connectionStatus")
			});
		});
	}

	render() {
		return (
			<BannerOffline {...this.props} {...this.state} />
		);
	}
}

export default Controller(BannerOfflineController);
