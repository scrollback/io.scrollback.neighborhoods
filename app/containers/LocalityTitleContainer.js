import React from "react-native";
import LocalityTitle from "../views/LocalityTitle";
import Container from "./Container";
import store from "../store/store";

const {
	InteractionManager
} = React;

class LocalityTitleContainer extends React.Component {
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

	_updateData = () => {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				const room = store.getRoom(this.props.room);

				if (room.guides && room.guides.displayName) {
					this.setState({ room });
				}
			}
		});
	};

	render() {
		return <LocalityTitle {...this.state} />;
	}
}

LocalityTitleContainer.propTypes = {
	room: React.PropTypes.string.isRequired
};

export default Container(LocalityTitleContainer);
