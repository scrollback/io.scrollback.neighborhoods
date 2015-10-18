import React from "react-native";
import App from "../components/app";
import Linking from "../../modules/linking";
import GCM from "../../push-notification/gcm";
import routes from "../utils/routes";
import controller from "./controller";

@controller
export default class AppController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "missing",
			connectionStatus: "connecting",
			initialRoute: null
		};
	}

	componentWillMount() {
		Linking.getInitialURL(url => {
			if (url) {
				this.setState({
					initialRoute: routes.fromURL(url)
				});
			}
		});

		this.handle("statechange", changes => {
			if (changes && "user" in changes || this.state.user === "missing" && changes.app.connectionStatus) {
				const user = this.store.get("user");
				const connectionStatus = this.store.get("app", "connectionStatus") || "conn";

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

		GCM.initialize();
	}

	render() {
		return <App {...this.props} {...this.state} />;
	}
}
