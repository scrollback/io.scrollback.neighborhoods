/* @flow */

import React from "react-native";
import Localities from "../views/Localities";
import Container from "./Container";
import store from "../store/store";

class LocalitiesContainer extends React.Component {
	state = {
		data: [ "missing" ]
	};

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			const user = store.get("user");

			if ((changes.indexes && changes.indexes.userRooms && changes.indexes.userRooms[user]) || (changes.app && changes.app.nearByRooms)) {
				this._updateData();
			}
		});

		this.runAfterInteractions(() => {
			this.emit("setstate", {
				nav: { mode: "home" }
			});
		});
	}

	_updateData = () => {

		const following = store.getRelatedRooms().filter(room => room.role && room.role !== "none");
		const user = store.getUser();
		const available = user && user.params ? user.params.skipped !== true : false;

		let data;

		if (available) {
			data = following;
		} else {
			data = [ {
				id: "open-house",
				guides: {
					displayName: "Open House"
				}
			} ];
		}

		this.setState({
			data,
			available
		});
	};

	render() {
		return (
			<Localities
				{...this.props}
				{...this.state}
			/>
		);
	}
}

export default Container(LocalitiesContainer);
