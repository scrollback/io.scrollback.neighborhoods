import React from "react-native";
import Splash from "./Splash";
import Onboard from "./Onboard";
import Home from "./Home";
import Offline from "./Offline";
import userUtils from "../lib/user-utils";

const PERSISTANCE_KEY = "FLAT_PERSISTENCE_0";

export default class App extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.user !== nextProps.user ||
			this.props.connectionStatus !== nextProps.connectionStatus ||
			this.props.initialNavigationState !== nextProps.initialNavigationState
		);
	}

	render() {
		const { user, connectionStatus, initialNavigationState } = this.props;

		if (user === "missing") {
			if (connectionStatus === "offline") {
				return <Offline />;
			} else {
				return <Splash />;
			}
		}

		if (userUtils.isGuest(user)) {
			return <Onboard persistenceKey={PERSISTANCE_KEY} initialNavigationState={initialNavigationState} />;
		}

		return <Home persistenceKey={PERSISTANCE_KEY} initialNavigationState={initialNavigationState} />;
	}
}

App.propTypes = {
	user: React.PropTypes.string.isRequired,
	connectionStatus: React.PropTypes.oneOf([ "connecting", "online", "offline" ]).isRequired,
	initialNavigationState: React.PropTypes.object
};
