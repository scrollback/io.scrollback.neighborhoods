import React from "react-native";
import AppbarTouchable from "./appbar-touchable";
import AvatarController from "../controllers/avatar-controller";
import routes from "../utils/routes";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	avatar: {
		height: 24,
		width: 24,
		borderRadius: 12,
		backgroundColor: "rgba(255, 255, 255, .16)",
		borderColor: "#fff",
		borderWidth: 2,
		margin: 16
	},
	image: {
		flex: 1,
		borderRadius: 12
	}
});

export default class UserIcon extends React.Component {
	_onPress() {
		this.props.navigator.push(routes.account());
	}

	render() {
		return (
			<AppbarTouchable onPress={this._onPress.bind(this)}>
				<View style={styles.avatar}>
					<AvatarController
						size={20}
						nick={this.props.nick}
						style={styles.image}
					/>
				</View>
			</AppbarTouchable>
		);
	}
}

UserIcon.propTypes = {
	nick: React.PropTypes.string.isRequired,
	navigator: React.PropTypes.object.isRequired
};
