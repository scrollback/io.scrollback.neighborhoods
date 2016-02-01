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
		marginVertical: 8,
		height: 56,
	},

	label: {
		fontSize: 12,
		lineHeight: 18,
		fontWeight: "bold",
		color: Colors.info,
	},

	hint: {
		fontSize: 12,
		lineHeight: 18,
		color: Colors.info,
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

	icon: {
		color: Colors.white
	},

	labelContainer: {
		flex: 1
	},
});

type Props = {
	label: string;
}

export default class PlaceButton extends React.Component {
	props: Props;

	_handlePress = () => {
		requestAnimationFrame(() =>	this.props.onPress(this.props.type));
	};

	render() {
		return (
			<TouchableOpacity {...this.props} onPress={this._handlePress}>
				<View style={styles.container}>
				<View style={styles.iconContainer}>
					<Icon
						style={styles.icon}
						name="add"
						size={16}
					/>
				</View>
				<View style={styles.labelContainer}>
					<AppText style={styles.label} numberOfLines={1}>{this.props.label.toUpperCase()}</AppText>
					<AppText style={styles.hint} numberOfLines={1}>{this.props.hint}</AppText>
				</View>
				</View>
			</TouchableOpacity>
		);
	}
}

PlaceButton.propTypes = {
	label: React.PropTypes.string.isRequired,
	hint: React.PropTypes.string.isRequired,
	type: React.PropTypes.string.isRequired,
	onPress: React.PropTypes.func.isRequired,
};

export default PlaceButton;
