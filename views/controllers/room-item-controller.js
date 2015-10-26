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

	async _joinCommunity() {
		return await this.dispatch("join", {
			to: this.props.room.id
		});
	}

	async _leaveCommunity() {
		const room = this.props.room.id;

		await this.dispatch("part", {
			to: room
		});

		return await this.dispatch("away", {
			to: room
		});
	}

	async _autoJoin() {
		const { room } = this.props;

		// Auto join room
		if (this.state.role === "none") {
			try {
				await this.dispatch("join", {
					to: room.id
				});
			} catch (err) {
				// Do nothing
			}
		}

		if (room.guides && room.guides.alsoAutoFollow) {
			try {
				await this.dispatch("join", {
					to: room.guides.alsoAutoFollow
				});
			} catch (e) {
				// Ignore
			}
		}
	}

	render() {
		return (
			<RoomItem
				{...this.props}
				{...this.state}
				joinCommunity={this._joinCommunity.bind(this)}
				leaveCommunity={this._leaveCommunity.bind(this)}
				autoJoin={this._autoJoin.bind(this)}
			/>
		);
	}
}

RoomItemController.propTypes = {
	room: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		guides: React.PropTypes.shape({
			alsoAutoFollow: React.PropTypes.string
		})
	})
};
