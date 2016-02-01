/* @flow */

import React from "react-native";
import AppText from "../AppText";
import Icon from "../Icon";
import Colors from "../../../Colors.json";

const {
	View,
	TouchableOpacity,
	StyleSheet
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 12,
	},

	name: {
		fontSize: 14,
		lineHeight: 21,
		fontWeight: "bold",
		color: Colors.darkGrey,
	},

	type: {
		fontSize: 12,
		lineHeight: 18,
		color: Colors.fadedBlack,
	},

	iconContainer: {
		alignItems: "center",
		justifyContent: "center",
		height: 36,
		width: 36,
		borderRadius: 18,
		backgroundColor: Colors.underlay,
		marginHorizontal: 16,
	},

	icon: {
		color: Colors.fadedBlack
	},

	closeContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 16,
		marginHorizontal: 8,
		borderRadius: 8,
		backgroundColor: Colors.underlay,
	},

	nameContainer: {
		flex: 1
	},
});

const ICONS = {
	current: "location-city",
	home: "home",
	work: "work"
};

export default class PlaceItem extends React.Component {
	static propTypes = {
		place: React.PropTypes.shape({
			id: React.PropTypes.string.isRequired,
			guides: React.PropTypes.shape({
				displayName: React.PropTypes.string
			})
		}),
		type: React.PropTypes.oneOf([ "current", "home", "work" ]).isRequired,
		onRemove: React.PropTypes.func.isRequired
	};

	_handleRemove = () => {
		this.props.onRemove(this.props.place, this.props.type);
	};

	render() {
		const {
			place,
			type
		} = this.props;

		return (
			<View style={styles.container}>
				<View style={styles.iconContainer}>
					<Icon
						style={styles.icon}
						name={ICONS[type]}
						size={16}
					/>
				</View>
				<View style={styles.nameContainer}>
					<AppText style={styles.name} numberOfLines={1}>{place.guides ? place.guides.displayName : place.id}</AppText>
					<AppText style={styles.type}>{type.charAt(0).toUpperCase() + type.slice(1)}</AppText>
				</View>
				<TouchableOpacity onPress={this._handleRemove}>
					<View style={styles.closeContainer}>
						<Icon
							style={styles.icon}
							name="close"
							size={12}
						/>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

export default PlaceItem;
