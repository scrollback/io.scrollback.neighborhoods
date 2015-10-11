import React from "react-native";
import Splash from "./splash";
import Onboard from "./onboard";
import Home from "./home";
import userUtils from "../../lib/user-utils";

export default class App extends React.Component {
	render() {
		const { user, initialRoute } = this.props;

		if (user === "LOADING") {
			return <Splash />;
		}

		if (user === "FAILED" || userUtils.isGuest(user)) {
			return <Onboard initialRoute={initialRoute} />;
		}

		return <Home initialRoute={initialRoute} />;
	}
}

App.propTypes = {
	user: React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "LOADING", "FAILED" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	]).isRequired,
	initialRoute: React.PropTypes.object
};
