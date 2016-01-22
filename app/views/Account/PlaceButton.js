/* @flow */

import React from "react-native";
import AppText from "../AppText";
import Icon from "../Icon";
import Colors from "../../../Colors.json";

const {
	StyleSheet,
	TouchableOpacity,
	View,
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 12,
	},

	name: {
		fontSize: 12,
		lineHeight: 18,
		fontWeight: "bold",
		color: Colors.info,
	},

	icon: {
		color: Colors.white
	},

	iconContainer: {
		alignItems: "center",
		justifyContent: "center",
		height: 36,
		width: 36,
		borderRadius: 18,
		backgroundColor: Colors.info,
		marginHorizontal: 16,
	},
});

type Props = {
	label: string;
}

export default class PlaceButton extends React.Component {
	props: Props;

	render() {
		return (
			<TouchableOpacity {...this.props}>
				<View style={styles.container}>
					<View style={styles.iconContainer}>
						<Icon
							style={styles.icon}
							name="add"
							size={16}
						/>
					</View>
					<AppText style={styles.name}>{this.props.label.toUpperCase()}</AppText>
				</View>
			</TouchableOpacity>
		);
	}
}

PlaceButton.propTypes = {
	label: React.PropTypes.string.isRequired,
};

export default PlaceButton;
