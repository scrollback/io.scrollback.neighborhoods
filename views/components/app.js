import React from "react-native";
import Splash from "./splash";
import Onboard from "./onboard";
import Home from "./home";
import userUtils from "../../lib/user-utils";

export default class App extends React.Component {
	render() {
		const { user, initialRoute } = this.props;

		if (user === "loading") {
			return <Splash />;
		}

		if (user === "missing" || userUtils.isGuest(user)) {
			return <Onboard initialRoute={initialRoute} />;
		}

		return <Home initialRoute={initialRoute} />;
	}
}

App.propTypes = {
	user: React.PropTypes.string.isRequired,
	initialRoute: React.PropTypes.object
};