import React from "react-native";
import Splash from "./splash";
import Onboard from "./onboard";
import Home from "./home";
import PageFailed from "./page-failed";
import userUtils from "../../lib/user-utils";

export default class App extends React.Component {
	render() {
		const { user, connectionStatus, initialRoute } = this.props;

		if (user === "missing") {
			if (connectionStatus === "offline") {
				return <PageFailed pageLabel="Cannot connect to internet" />;
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
	connectionStatus: React.PropTypes.string.isRequired,
	initialRoute: React.PropTypes.object
};
