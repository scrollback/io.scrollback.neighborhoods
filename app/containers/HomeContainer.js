/* @flow */

import React from "react-native";
import Home from "../views/Home";
import Linking from "../modules/Linking";
import Container from "./Container";

class AppContainer extends React.Component {
	state = {
		initialURL: "missing"
	};

	componentDidMount() {
		this._setInitialURL();
	}

	_setInitialURL = () => {
		Linking.getInitialURL(url => {
			this.setState({
				initialURL: url
			});
		});
	};

	render() {
		if (this.state.initialURL === "missing") {
			return null;
		} else {
			return <Home {...this.props} {...this.state} />;
		}
	}
}

export default Container(AppContainer);
