import React from "react-native";
import Colors from "../../colors.json";
import AppbarTouchable from "./appbar-touchable";
import AppbarIcon from "./appbar-icon";
import NotificationBadgeContainer from "../containers/notification-badge-container";
import routes from "../utils/routes";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	badge: {
		position: "absolute",
		top: 10,
		right: 10,
		backgroundColor: Colors.badge,
		elevation: 2
	}
});

export default class NotificationIcon extends React.Component {
	_onPress() {
		this.props.navigator.push(routes.notes());
	}

	render() {
		return (
			<AppbarTouchable onPress={this._onPress.bind(this)}>
				<View>
					<AppbarIcon name="notifications" />
					<NotificationBadgeContainer style={styles.badge} grouped />
				</View>
			</AppbarTouchable>
		);
	}
}

NotificationIcon.propTypes = {
	navigator: React.PropTypes.object.isRequired
};
