/* @flow */

import React from "react-native";
import AppText from "../AppText";
import Icon from "../Icon";
import Colors from "../../../Colors.json";

const {
	View,
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
		height: 16,
		width: 16,
		borderRadius: 8,
		backgroundColor: Colors.underlay,
	},

	nameContainer: {
		flex: 1
	},
});

type Props = {
	name: string;
	type: string;
}

const PlaceItem = (props: Props) => (
	<View style={styles.container}>
		<View style={styles.iconContainer}>
			<Icon
				style={styles.icon}
				name={props.type}
				size={16}
			/>
		</View>
		<View style={styles.nameContainer}>
			<AppText style={styles.name}>{props.name}</AppText>
			<AppText style={styles.type}>{props.type.charAt(0).toUpperCase() + props.type.slice(1)}</AppText>
		</View>
		<View style={styles.closeContainer}>
			<Icon
				style={styles.icon}
				name="close"
				size={12}
			/>
		</View>
	</View>
);

PlaceItem.propTypes = {
	name: React.PropTypes.string.isRequired,
	type: React.PropTypes.string.isRequired,
};

export default PlaceItem;
