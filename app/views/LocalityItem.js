import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import NotificationBadgeContainer from "../containers/NotificationBadgeContainer";
import ListItem from "./ListItem";
import Icon from "./Icon";
import Modal from "./Modal";
import Share from "../modules/Share";
import Linking from "../modules/Linking";
import locationUtils from "../lib/location-utils";
import { convertRouteToURL } from "../routes/Route";
import config from "../store/config";

const {
	StyleSheet,
	TouchableOpacity,
	View
} = React;

const styles = StyleSheet.create({
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
	_handleShowMenu = () => {
		const { room } = this.props;

		const options = [];
		const actions = [];

		options.push("Share community");
		actions.push(() => {
			Share.shareItem("Share community", config.server.protocol + "//" + config.server.host + convertRouteToURL({
				name: "room",
				props: {
					room
				}
			}));
		});

		if (room.location && room.location.lat && room.location.lon) {
			options.push("View in Google Maps");
			actions.push(() => {
				const { lat, lon } = room.location;

				Linking.openURL("http://maps.google.com/maps?q=loc:" + lat + "," + lon);
			});
		}

		Modal.showActionSheetWithOptions({ options }, index => actions[index]());
	};

	_handlePress = () => {
		if (this.props.onSelect) {
			this.props.onSelect(this.props.room);
		}
	};

	render() {
		const { room, location } = this.props;

		return (
			<View {...this.props}>
				<ListItem onPress={this._handlePress}>
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
						<TouchableOpacity onPress={this._handleShowMenu}>
							<Icon
								name="expand-more"
								style={styles.expand}
								size={20}
							/>
						</TouchableOpacity> :
						null
					}
				</ListItem>
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
	showMenuButton: React.PropTypes.bool,
	showBadge: React.PropTypes.bool,
	onSelect: React.PropTypes.func,
};

LocalityItem.defaultProps = {
	showMenuButton: true,
	showBadge: true
};
