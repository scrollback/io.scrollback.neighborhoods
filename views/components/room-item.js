import React from "react-native";
import TouchFeedback from "./touch-feedback";
import routes from "../utils/routes";
import locationUtils from "../../lib/location-utils";

const {
	StyleSheet,
	PixelRatio,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	item: {
		justifyContent: "center",
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .08)",
		borderBottomWidth: 1 / PixelRatio.get(),
		paddingHorizontal: 16,
		height: 64
	},
	title: {
		fontSize: 14,
		lineHeight: 21,
		fontWeight: "bold"
	},
	distance: {
		fontSize: 12,
		lineHeight: 18,
		opacity: 0.7
	}
});

export default class RoomItem extends React.Component {
	_onPress() {
		this.props.navigator.push(routes.room({ room: this.props.room.id }));
	}

	render() {
		const { room, position } = this.props;

		return (
			<View {...this.props}>
				<TouchFeedback onPress={this._onPress.bind(this)}>
					<View style={styles.item}>
						<Text style={styles.title}>{room.displayName || room.id}</Text>
						{position && position.coords && room.latitude && room.longitude ?
							<Text style={styles.distance}>{locationUtils.getFormattedDistance(position.coords, room)}</Text> :
							null
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
	navigator: React.PropTypes.object.isRequired
};
