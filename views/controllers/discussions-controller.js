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
			data: [ "loading" ]
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes.threads && changes.threads[this.props.room]) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			const data = this.store.getThreads(this.props.room, null, -10);

			if (this._mounted) {
				this.setState({ data });
			}
		});
	}

	_onError() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					data: [ "missing" ]
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
