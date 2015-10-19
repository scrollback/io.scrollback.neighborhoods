import React from "react-native";
import PeopleList from "../components/people-list";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class PeopleListController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "missing" ]
		};
	}

	componentDidMount() {
		const thread = this.store.getThreadById(this.props.thread);

		if (thread && thread.concerns) {
			const data = [];

			for (let i = 0, l = thread.concerns.length; i < l; i++) {
				const user = thread.concerns[i];
				const relation = this.store.get("entities", thread.to + "_" + user);

				if (relation) {
					data.push({
						id: user,
						status: relation.status
					});
				} else {
					data.push({
						id: user
					});
				}
			}

			this._onDataArrived(data);
		} else {
			this._onError();
		}
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
					data: [ "missing" ]
				});
			}
		});
	}

	_refreshData() {

	}

	render() {
		return (
			<PeopleList
				{...this.props}
				{...this.state}
				refreshData={this._refreshData.bind(this)}
			/>
		);
	}
}

PeopleListController.propTypes = {
	thread: React.PropTypes.string.isRequired
};
