import React from "react-native";
import Icon from "./icon";
import routes from "../utils/routes";

const {
	StyleSheet,
	TouchableHighlight,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	container: {
		position: "relative"
	},
	icon: {
		margin: 16,
		fontSize: 24,
		color: "#fff"
	},
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
		global.requestAnimationFrame(() => this.props.navigator.push(routes.notes()));
	}

	render() {
		const { count } = this.props;

		return (
			<TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" onPress={this._onPress.bind(this)}>
				<View style={styles.container}>
					<Icon name="notifications" style={styles.icon} />
					{count ?
						<View style={styles.badge}>
							<Text style={styles.count}>
								{count < 100 ? count : "99+"}
							</Text>
						</View> :
						null
					}
				</View>
			</TouchableHighlight>
		);
	}
}

NotificationIcon.propTypes = {
	count: React.PropTypes.number.isRequired,
	navigator: React.PropTypes.object.isRequired
};
