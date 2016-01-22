/* @flow */

import React from "react-native";
import PeopleList from "../views/PeopleList";
import Container from "./Container";
import store from "../store/store";

class PeopleListContainer extends React.Component {
	static propTypes = {
		thread: React.PropTypes.shape({
			concerns: React.PropTypes.arrayOf([ React.PropTypes.string ])
		}).isRequired
	};

	state = {
		data: [ "missing" ]
	};

	componentDidMount() {
		this.runAfterInteractions(this._updateData);
	}

	_updateData = () => {
		const { thread } = this.props;

		if (thread && thread.concerns) {
			const data: Array<{
				id: string,
				status?: string
			}> = [];

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

			this.setState({ data });
		} else {
			this.setState({ data: [ "failed" ] });
		}
	};

	render() {
		return <PeopleList {...this.props} {...this.state} />;
	}
}

export default Container(PeopleListContainer);
