/* @flow */

import React from "react-native";
import LocalityItem from "../views/LocalityItem";
import Container from "./Container";
import store from "../store/store";

class LocalityItemContainer extends React.Component {
	static propTypes = {
		room: React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			guides: React.PropTypes.shape({
				alsoAutoFollow: React.PropTypes.string
			})
		})
	};

	state = {
		role: "none"
	};

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

	render() {
		return (
			<LocalityItem
				{...this.props}
				{...this.state}
				joinCommunity={this._joinCommunity}
				leaveCommunity={this._leaveCommunity}
			/>
		);
	}
}

export default Container(LocalityItemContainer);
