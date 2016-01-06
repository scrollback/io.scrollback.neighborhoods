import React from "react-native";
import PeopleList from "../views/PeopleList";
import Container from "./Container";
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
		const { thread } = this.props;

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

			data.sort((a, b) => {
				if (a.status === b.status) {
					return 0;
				} else if (a.status === "online") {
					return -1;
				} else {
					return 1;
				}
			});

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
	thread: React.PropTypes.shape({
		concerns: React.PropTypes.arrayOf([ React.PropTypes.string ])
	}).isRequired
};

export default Container(PeopleListContainer);
