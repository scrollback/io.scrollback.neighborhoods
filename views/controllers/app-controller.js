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
			user: "loading",
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

		this.handle("statechange", changes => {
			if (changes && changes.user) {
				const user = this.store.get("user");

				if (user !== this.state.user) {
					this.setState({ user });
				}
			}
		});
	}

	render() {
		return <App {...this.props} {...this.state} />;
	}
}
