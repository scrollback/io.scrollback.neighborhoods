import React from "react-native";
import Colors from "../../colors.json";
import Icon from "./icon";

const {
	StyleSheet,
	TouchableHighlight,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		height: 36,
		width: 36,
		borderRadius: 18,
		elevation: 4
	},
	button: {
		backgroundColor: Colors.darkGrey,
		height: 36,
		width: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center"
	},
	icon: {
		color: Colors.white
	}
});

export default class CloseButton extends React.Component {
	render() {
		return (
			<TouchableHighlight
				{...this.props}
				underlayColor={Colors.underlay}
				style={[ styles.container, this.props.style ]}
			>
				<View style={styles.button}>
					<Icon
						name="close"
						style={styles.icon}
						size={16}
					/>
				</View>
			</TouchableHighlight>
		);
	}
}
