import React from "react-native";
import UserIcon from "../components/user-icon";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class UserIconController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			nick: ""
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if ("user" in changes) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					nick: this.store.get("user")
				});
			}
		});
	}

	render() {
		return <UserIcon {...this.props} nick={this.state.nick} />;
	}
}
