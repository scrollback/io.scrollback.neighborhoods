import React from "react-native";
import LocalityItem from "../views/LocalityItem";
import Container from "./Container";
import store from "../store/store";

class LocalityItemContainer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			role: "none"
		};
	}

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle("statechange", changes => {
			const user = store.get("user");

			if (changes.entities && changes.entities[this.props.room.id + "_" + user]) {
				this._updateData();
			}
		});
	}

	_updateData = () => {
		const role = store.getUserRole(store.get("user"), this.props.room.id);

		this.setState({
			role: role === "registered" || !role ? "none" : role
		});
	};

	_joinCommunity = async () => {
		return await this.dispatch("join", {
			to: this.props.room.id
		});
	};

	_leaveCommunity = async () => {
		const room = this.props.room.id;

		await this.dispatch("part", {
			to: room
		});

		return await this.dispatch("away", {
			to: room
		});
	};

	_autoJoin = async () => {
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
	};

	render() {
		return (
			<LocalityItem
				{...this.props}
				{...this.state}
				joinCommunity={this._joinCommunity}
				leaveCommunity={this._leaveCommunity}
				autoJoin={this._autoJoin}
			/>
		);
	}
}

LocalityItemContainer.propTypes = {
	room: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		guides: React.PropTypes.shape({
			alsoAutoFollow: React.PropTypes.string
		})
	})
};

export default Container(LocalityItemContainer);
