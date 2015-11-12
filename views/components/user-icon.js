import React from "react-native";
import Colors from "../../colors.json";
import AppbarTouchable from "./appbar-touchable";
import AvatarController from "../controllers/avatar-controller";
import routes from "../utils/routes";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	avatar: {
		height: 26,
		width: 26,
		borderRadius: 13,
		borderColor: Colors.white,
		borderWidth: 1,
		margin: 15
	},
	image: {
		flex: 1,
		borderRadius: 13
	}
});

export default class UserIcon extends React.Component {
	shouldComponentUpdate(nextProps) {
		return this.props.nick !== nextProps.nick;
	}

	_onPress() {
		this.props.navigator.push(routes.account());
	}

	render() {
		return (
			<AppbarTouchable onPress={this._onPress.bind(this)}>
				<View style={styles.avatar}>
					<AvatarController
						size={24}
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
