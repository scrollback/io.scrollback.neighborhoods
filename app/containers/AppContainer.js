/* @flow */

import React from "react-native";
import App from "../views/App";
import Linking from "../modules/Linking";
import Container from "./Container";
import { getHomeRoute, convertRouteToState, convertURLToState } from "../routes/Route";
import store from "../store/store";

class AppContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "missing",
			connectionStatus: "connecting",
			initialNavigationState: null
		};
	}

	componentWillMount() {
		this._setInitialNavigationState();

		this.handle("statechange", changes => {
			if (changes && "user" in changes || this.state.user === "missing" && changes.app.connectionStatus) {
				const user = store.get("user");
				const connectionStatus = store.get("app", "connectionStatus") || "connecting";

				if (this._mounted) {
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
				}
			}
		});
	}

	_setInitialNavigationState = () => {
		Linking.getInitialURL(url => {
			this.setState({
				initialNavigationState: url ? convertURLToState(url) : convertRouteToState(getHomeRoute())
			});
		});
	};

	render() {
		return <App {...this.props} {...this.state} />;
	}
}

export default Container(AppContainer);
