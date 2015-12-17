import React from "react-native";
import PeopleList from "../views/people-list";
import Container from "./controller";
import store from "../store/store";

const {
	InteractionManager
} = React;

class PeopleListContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "missing" ]
		};
	}

	componentDidMount() {
		const thread = store.getThreadById(this.props.thread);

		if (thread && thread.concerns) {
			const data = [];

			for (let i = 0, l = thread.concerns.length; i < l; i++) {
				const user = thread.concerns[i];
				const relation = store.get("entities", thread.to + "_" + user);

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
					data: [ "failed" ]
				});
			}
		});
	}

	render() {
		return (
			<PeopleList
				{...this.props}
				{...this.state}
			/>
		);
	}
}

PeopleListContainer.propTypes = {
	thread: React.PropTypes.string.isRequired
};

export default Container(PeopleListContainer);
