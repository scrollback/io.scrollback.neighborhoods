import React from "react-native";
import App from "../views/app";
import Linking from "../modules/linking";
import routes from "../utils/routes";
import Container from "./container";
import store from "../store/store";

class AppContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "missing",
			connectionStatus: "connecting",
			initialRoute: null
		};
	}

	componentWillMount() {
		this._setInitialRoute();

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

	_setInitialRoute() {
		Linking.getInitialURL((err, url) => {
			if (err) {
				return;
			}

			if (url) {
				this.setState({
					initialRoute: routes.fromURL(url)
				});
			}
		});
	}

	render() {
		return <App {...this.props} {...this.state} />;
	}
}

export default Container(AppContainer);
