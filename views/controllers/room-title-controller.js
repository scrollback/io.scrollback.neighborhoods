import React from "react-native";
import RoomTitle from "../components/room-title";
import Controller from "./controller";

const {
	InteractionManager
} = React;

class RoomTitleController extends React.Component {
	constructor(props) {
		super(props);

		const displayName = this.props.room.replace(/-+/g, " ").replace(/\w\S*/g, s => s.charAt(0).toUpperCase() + s.slice(1)).trim();

		this.state = {
			room: {
				guides: { displayName }
			}
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			if (changes.entities && changes.entities[this.props.room]) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const room = this.store.getRoom(this.props.room);

				if (room.guides && room.guides.displayName) {
					this.setState({ room });
				}
			}
		});
	}

	render() {
		return <RoomTitle {...this.state} />;
	}
}

RoomTitleController.propTypes = {
	room: React.PropTypes.string.isRequired
};

export default Controller(RoomTitleController);
