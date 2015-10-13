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
			data: [ "loading" ]
		};
	}

	componentDidMount() {
		const thread = this.store.getThreadById(this.props.thread);

		if (thread && thread.concerns) {
			const currentUser = this.store.get("user");
			const relatedUsers = this.store.getRelatedUsers(thread.to);

			const data = [];

			for (let i = 0, l = relatedUsers.length; i < l; i++) {
				const relation = relatedUsers[i];
				const user = relation.id;

				if (thread.concerns.indexOf(user) > -1 || user === currentUser) {
					data.push(relation);
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
