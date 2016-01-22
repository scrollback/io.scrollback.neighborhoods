/* @flow */

import React from "react-native";
import BannerOffline from "../views/BannerOffline";
import Container from "./Container";
import store from "../store/store";

class BannerOfflineContainer extends React.Component {
	state = {
		connectionStatus: null
	};

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			if (changes.app && changes.app.connectionStatus) {
				this._updateData();
			}
		});
	}

	_updateData = () => {
		this.setState({
			connectionStatus: store.get("app", "connectionStatus")
		});
	};

	render() {
		return (
			<BannerOffline {...this.props} {...this.state} />
		);
	}
}

export default Container(BannerOfflineContainer);
