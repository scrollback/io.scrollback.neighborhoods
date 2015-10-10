import React from "react-native";
import App from "../components/app";
import Linking from "../../modules/linking";
import routes from "../utils/routes";
import controller from "./controller";

@controller
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
		setTimeout(() => {
			if (this._mounted) {
				this._onDataArrived(this.store.getUser());
			}
		}, 500);
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
