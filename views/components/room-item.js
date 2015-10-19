import React from "react-native";
import TouchFeedback from "./touch-feedback";
import Icon from "./icon";
import Modal from "./modal";
import Share from "../../modules/share";
import routes from "../utils/routes";
import locationUtils from "../../lib/location-utils";
import config from "../../store/config";

const {
	StyleSheet,
	PixelRatio,
	TouchableOpacity,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "stretch",
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .08)",
		borderBottomWidth: 1 / PixelRatio.get(),
		height: 64
	},
	item: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16
	},
	title: {
		color: "#555",
		fontSize: 14,
		lineHeight: 21,
		fontWeight: "bold"
	},
	distance: {
		color: "#999",
		fontSize: 12,
		lineHeight: 18
	},
	expand: {
		marginHorizontal: 16,
		marginVertical: 18,
		color: "#000",
		fontSize: 24,
		opacity: 0.5
	}
});

export default class RoomItem extends React.Component {
	_showMenu() {
		const options = [];
		const actions = [];

		options.push("Share community");
		actions.push(() => {
			const { protocol, host } = config.server;

			Share.shareItem("Share community", `${protocol}//${host}/${this.props.room}`);
		});

		switch (this.props.role) {
		case "none":
			options.push("Join community");
			actions.push(this.props.joinCommunity);
			break;
		case "follower":
			options.push("Leave community");
			actions.push(this.props.leaveCommunity);
			break;
		}

		Modal.showActionSheetWithOptions({ options }, index => actions[index]());
	}

	_onPress() {
		this.props.navigator.push(routes.room({ room: this.props.room.id }));
	}

	render() {
		const { room, position } = this.props;

		return (
			<View {...this.props}>
				<TouchFeedback onPress={this._onPress.bind(this)}>
					<View style={styles.container}>
						<View style={styles.item}>
							<Text style={styles.title}>{room.displayName || room.id}</Text>
							{position && position.coords && room.latitude && room.longitude ?
								<Text style={styles.distance}>{locationUtils.getFormattedDistance(position.coords, room)}</Text> :
								null
							}
						</View>
						{this.props.showRoomMenu ?
							<TouchableOpacity onPress={this._showMenu.bind(this)}>
								<Icon name="expand-more" style={styles.expand} />
							</TouchableOpacity> : null
						}
					</View>
				</TouchFeedback>
			</View>
		);
	}
}

RoomItem.propTypes = {
	room: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		displayName: React.PropTypes.string.isRequired,
		latitude: React.PropTypes.number.isRequired,
		longitude: React.PropTypes.number.isRequired
	}),
	position: React.PropTypes.shape({
		coords: React.PropTypes.shape({
			latitude: React.PropTypes.number.isRequired,
			longitude: React.PropTypes.number.isRequired
		})
	}),
	role: React.PropTypes.string.isRequired,
	showRoomMenu: React.PropTypes.bool,
	joinCommunity: React.PropTypes.func.isRequired,
	leaveCommunity: React.PropTypes.func.isRequired,
	navigator: React.PropTypes.object.isRequired
};

RoomItem.defaultProps = {
	showRoomMenu: true
};
