import React from "react-native";
import AppbarTouchable from "./appbar-touchable";
import AppbarIcon from "./appbar-icon";
import routes from "../utils/routes";

const {
	StyleSheet,
	Text
} = React;

const styles = StyleSheet.create({
	badge: {
		position: "absolute",
		top: 10,
		right: 10,
		height: 24,
		width: 24,
		borderRadius: 12,
		paddingVertical: 4,
		backgroundColor: "#E91E63"
	},
	count: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 10,
		textAlign: "center"
	}
});

export default class NotificationIcon extends React.Component {
	_onPress() {
		this.props.navigator.push(routes.notes());
	}

	render() {
		const { count } = this.props;

		return (
			<AppbarTouchable onPress={this._onPress.bind(this)}>
				<AppbarIcon name="notifications" />
				{count ?
					<Text style={styles.count}>
						{count < 100 ? count : "99+"}
					</Text> :
					null
				}
			</AppbarTouchable>
		);
	}
}

NotificationIcon.propTypes = {
	count: React.PropTypes.number.isRequired,
	navigator: React.PropTypes.object.isRequired
};
