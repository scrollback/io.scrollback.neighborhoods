import React from "react-native";
import Splash from "./splash";
import Onboard from "./onboard";
import Home from "./home";
import PageEmpty from "./page-empty";
import userUtils from "../lib/user-utils";

export default class App extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.user !== nextProps.user ||
			this.props.connectionStatus !== nextProps.connectionStatus ||
			this.props.initialRoute !== nextProps.initialRoute
		);
	}

	render() {
		const { user, connectionStatus, initialRoute } = this.props;

		if (user === "missing") {
			if (connectionStatus === "offline") {
				return <PageEmpty pageLabel="Cannot connect to internet" />;
			} else {
				return <Splash />;
			}
		}

		if (userUtils.isGuest(user)) {
			return <Onboard initialRoute={initialRoute} />;
		}

		return <Home initialRoute={initialRoute} />;
	}
}

App.propTypes = {
	user: React.PropTypes.string.isRequired,
	connectionStatus: React.PropTypes.oneOf([ "connecting", "online", "offline" ]).isRequired,
	initialRoute: React.PropTypes.object
};
