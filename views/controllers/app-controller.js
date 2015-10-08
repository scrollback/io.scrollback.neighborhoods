import React from "react-native";
import App from "../components/app";
import Linking from "../../modules/linking";
import store from "../../store/store";
import routes from "../utils/routes";

export default class AppController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			user: "LOADING",
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
	}

	componentDidMount() {
		this._mounted = true;

		setTimeout(() => {
			if (this._mounted) {
				this._onDataArrived(store.getUser());
			}
		}, 500);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	_onDataArrived(user) {
		this.setState({ user });
	}

	_onError() {
		this.setState({
			user: "FAILED"
		});
	}

	render() {
		return <App {...this.props} {...this.state} />;
	}
}
