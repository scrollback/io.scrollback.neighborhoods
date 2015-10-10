import React from "react-native";
import Discussions from "../components/discussions";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class DiscussionsController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "LOADING" ]
		};
	}

	componentDidMount() {
		setTimeout(() => this._onDataArrived(this.store.getThreads(this.props.room)), 0);
	}

	_onDataArrived(data) {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({ data });
			}
		});
	}

	_onError() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					data: [ "FAILED" ]
				});
			}
		});
	}

	_refreshData() {

	}

	render() {
		return (
			<Discussions
				{...this.props}
				{...this.state}
				refreshData={this._refreshData.bind(this)}
			/>
		);
	}
}

DiscussionsController.propTypes = {
	room: React.PropTypes.string.isRequired
};
