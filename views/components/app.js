import React from "react-native";
import Splash from "./splash";
import Onboard from "./onboard";
import Home from "./home";

export default class App extends React.Component {
    render() {
        const { user, initialRoute } = this.props;

        if (user === "FAILED") {
            return <Onboard initialRoute={initialRoute} />;
        }

        if (user && user.id) {
            return <Home initialRoute={initialRoute} />;
        }

        return <Splash />;
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
