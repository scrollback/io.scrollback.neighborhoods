import React from "react-native";
import Icon from "./Icon";
import TouchFeedback from "./TouchFeedback";
import Colors from "../../Colors.json";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	checkbox: {
		padding: 10
	},

	checked: {
		color: Colors.info
	}
});

const Checkbox = props => {
	return (
		<TouchFeedback borderless onPress={props.onPress}>
			<View style={styles.checkbox}>
				<Icon
					name={props.checked ? "check-box" : "check-box-outline-blank"}
					size={props.size || 24}
					style={[ styles.icon, props.checked ? styles.checked : null ]}
				/>
			</View>
		</TouchFeedback>
	);
};

Checkbox.propTypes = {
	onPress: React.PropTypes.func.isRequired,
	checked: React.PropTypes.bool,
	size: React.PropTypes.number
};

export default Checkbox;
