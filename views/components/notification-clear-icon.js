import React from "react-native";
import Icon from "./icon";

const {
	StyleSheet,
	TouchableHighlight,
	View
} = React;

const styles = StyleSheet.create({
	icon: {
		margin: 16,
		fontSize: 24,
		color: "#fff"
	}
});

export default class NotificationClearIcon extends React.Component {
	render() {
		return (
			<TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" onPress={this.props.clearAll}>
				<View>
					<Icon name="clear-all" style={styles.icon} />
				</View>
			</TouchableHighlight>
		);
	}
}

NotificationClearIcon.propTypes = {
	clearAll: React.PropTypes.func.isRequired
};
