import React from "react-native";
import AppbarTouchable from "./appbar-touchable";
import AppbarIcon from "./appbar-icon";

export default class NotificationClearIcon extends React.Component {
	render() {
		return (
			<AppbarTouchable onPress={this.props.clearAll}>
				<AppbarIcon name="clear-all" />
			</AppbarTouchable>
		);
	}
}

NotificationClearIcon.propTypes = {
	clearAll: React.PropTypes.func.isRequired
};
