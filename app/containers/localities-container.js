import React from "react-native";
import Localities from "../views/localities";
import Container from "./container";
import store from "../store/store";

const {
	InteractionManager
} = React;

class LocalitiesContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: {
				following: [ "missing" ]
			}
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			const user = store.get("user");

			if ((changes.indexes && changes.indexes.userRooms && changes.indexes.userRooms[user]) || (changes.app && changes.app.nearByRooms)) {
				this._updateData();
			}
		});

		InteractionManager.runAfterInteractions(() => {
			this.emit("setstate", {
				nav: { mode: "home" }
			});
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const following = store.getRelatedRooms().filter(room => room.role && room.role !== "none");
				const followingRooms = following.map(room => room.id);
				const nearby = store.getNearByRooms().filter(room => followingRooms.indexOf(room.id) === -1);
				const available = store.get("app", "isAvailable") !== false;

				this.setState({
					data: {
						following,
						nearby
					},

					available
				});
			}
		});
	}

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
