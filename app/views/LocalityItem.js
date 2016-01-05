import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import NotificationBadgeContainer from "../containers/NotificationBadgeContainer";
import TouchFeedback from "./TouchFeedback";
import Icon from "./Icon";
import Modal from "./Modal";
import Share from "../modules/Share";
import Linking from "../modules/Linking";
import routes from "../utils/routes";
import url from "../lib/url";
import locationUtils from "../lib/location-utils";

const {
	StyleSheet,
	PixelRatio,
	TouchableOpacity,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get(),
		height: 64
	},
	item: {
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16
	},
	title: {
		color: Colors.darkGrey,
		fontWeight: "bold"
	},
	distance: {
		color: Colors.grey,
		fontSize: 12,
		lineHeight: 18
	},
	expand: {
		margin: 20,
		color: Colors.fadedBlack
	}
});

export default class LocalityItem extends React.Component {
	_showMenu() {
		const { room, role } = this.props;

		const options = [];
		const actions = [];

		options.push("Share community");
		actions.push(() => {
			Share.shareItem("Share community", url.get("room", room));
		});

		if (room.location && room.location.lat && room.location.lon) {
			options.push("View in Google Maps");
			actions.push(() => {
				const { lat, lon } = room.location;

				Linking.openURL("http://maps.google.com/maps?q=loc:" + lat + "," + lon);
			});
		}

		switch (role) {
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
		this.props.autoJoin();
	}

	render() {
		const { room, location } = this.props;

		return (
			<View {...this.props}>
				<TouchFeedback onPress={this._onPress.bind(this)}>
					<View style={styles.container}>
						<View style={styles.item}>
							<AppText style={styles.title}>{room.guides && room.guides.displayName ? room.guides.displayName : room.id}</AppText>
							{location && location.coords && room.location && room.location.lat && room.location.lon ?
								<AppText style={styles.distance}>
									{locationUtils.getFormattedDistance(location.coords, {
										latitude: room.location.lat,
										longitude: room.location.lon
									})}
								</AppText> :
								null
							}
						</View>

						{this.props.showBadge ?
							<NotificationBadgeContainer room={this.props.room.id} /> :
							null
						}

						{this.props.showMenuButton ?
							<TouchableOpacity onPress={this._showMenu.bind(this)}>
								<Icon
									name="expand-more"
									style={styles.expand}
									size={20}
								/>
							</TouchableOpacity> :
							null
						}
					</View>
				</TouchFeedback>
			</View>
		);
	}
}

LocalityItem.propTypes = {
	room: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		guides: React.PropTypes.shape({
			displayName: React.PropTypes.string
		}),
		location: React.PropTypes.shape({
			lat: React.PropTypes.number,
			lon: React.PropTypes.number
		})
	}),
	location: React.PropTypes.shape({
		coords: React.PropTypes.shape({
			latitude: React.PropTypes.number.isRequired,
			longitude: React.PropTypes.number.isRequired
		}).isRequired
	}),
	role: React.PropTypes.string.isRequired,
	showMenuButton: React.PropTypes.bool,
	showBadge: React.PropTypes.bool,
	joinCommunity: React.PropTypes.func.isRequired,
	leaveCommunity: React.PropTypes.func.isRequired,
	autoJoin: React.PropTypes.func.isRequired,
	navigator: React.PropTypes.object.isRequired
};

LocalityItem.defaultProps = {
	showMenuButton: true,
	showBadge: true
};
