import React from "react-native";
import RoomItem from "../components/room-item";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class RoomItemController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			role: "none"
		};
	}

	componentDidMount() {
		this._updateData();

		this.handle("statechange", changes => {
			const user = this.store.get("user");

			if (changes.entities && changes.entities[this.props.room.id + "_" + user]) {
				this._updateData();
			}
		});
	}

	_updateData() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const role = this.store.getUserRole(this.store.get("user"), this.props.room.id);

				this.setState({
					role: role === "registered" || !role ? "none" : role
				});
			}
		});
	}

	_joinCommunity() {
		this.dispatch("join", {
			to: this.props.room.id
		});
	}

	_leaveCommunity() {
		const room = this.props.room.id;

		this.dispatch("part", {
			to: room
		})
		.then(() => {
			return this.dispatch("away", {
				to: room
			});
		});
	}

	render() {
		return (
			<RoomItem
				{...this.props}
				{...this.state}
				joinCommunity={this._joinCommunity.bind(this)}
				leaveCommunity={this._leaveCommunity.bind(this)}
			/>
		);
	}
}

RoomItemController.propTypes = {
	room: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired
	})
};
