import React from "react-native";
import Localities from "../components/localities";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class LocalitiesController extends React.Component {
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
			const user = this.store.get("user");

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
				this.setState({
					data: {
						following: this.store.getRelatedRooms().filter(room => room.role && room.role !== "none"),
						nearby: this.store.getNearByRooms()
					}
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
