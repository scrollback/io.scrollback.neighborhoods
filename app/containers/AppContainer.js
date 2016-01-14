/* @flow */

import React from "react-native";
import App from "../views/App";
import Container from "./Container";
import store from "../store/store";

class AppContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "missing",
			connectionStatus: "connecting"
		};
	}

	componentWillMount() {
		this.handle("statechange", changes => {
			if (changes && "user" in changes || this.state.user === "missing" && changes.app.connectionStatus) {
				this._updateData();
			}
		});
	}

	_updateData = () => {
		const user = store.get("user");
		const connectionStatus = store.get("app", "connectionStatus") || "connecting";

		if (user && user !== this.state.user) {
			this.setState({
				user,
				connectionStatus
			});
		} else if (connectionStatus !== this.state.connectionStatus) {
			this.setState({
				connectionStatus
			});
		}
	};

	render() {
		return <App {...this.props} {...this.state} />;
	}
}

export default Container(AppContainer);
