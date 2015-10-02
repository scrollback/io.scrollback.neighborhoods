import React from "react-native";
import Splash from "./splash";
import SignIn from "./sign-in";
import Home from "./home";

export default class App extends React.Component {
    render() {
        const { user } = this.props;

        if (user === "FAILED") {
            return <SignIn navigator={this.props.navigator} />;
        }

        if (user && user.id) {
            return <Home navigator={this.props.navigator} />;
        }

        return <Splash navigator={this.props.navigator} />;
    }
}

App.propTypes = {
    user: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
        React.PropTypes.oneOf([ "LOADING", "FAILED" ]),
        React.PropTypes.shape({
            id: React.PropTypes.string
        })
    ])).isRequired
};

App.propTypes = {
    navigator: React.PropTypes.object.isRequired
};
